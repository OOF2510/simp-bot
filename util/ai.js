const { ChatOpenAI } = require("@langchain/openai");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");
const Groq = require("groq-sdk");
const { Mistral } = require("@mistralai/mistralai");
const { MongoClient } = require("mongodb");
const config = require("../config.json");

/**
 * Default headers we send up with every OpenRouter call so the service knows who's pinging it.
 */
const DEFAULT_HEADERS = {
  "HTTP-Referer": "https://discord.bot",
  "X-Title": "SimpBot",
};

/**
 * @typedef {Object} AiAttachment
 * @property {"image"|"video"} type - The media type being sent up with the prompt.
 * @property {string} [url] - Remote URL that OpenRouter can fetch directly.
 * @property {string|Buffer} [data] - Raw file contents (Buffer or base64 string).
 * @property {string} [mimeType] - Optional MIME type so we can hint the format when sending inline data.
 * @property {string} [format] - Explicit format override for video blobs (e.g., "mp4").
 */

/**
 * Wraps a Mongo collection to stash little convo snippets so the bot remembers what folks said.
 */
class AiMemoryStore {
  /**
   * Sets up the memory store with the chosen collection name while deferring the actual connection.
   * @param {{ collectionName?: string }} [options]
   */
  constructor({ collectionName = "ai_memory" } = {}) {
    this.uri = config.mongodb.url;
    this.dbName = config.mongodb.database;
    this.collectionName = collectionName;
    this.connectionPromise = null;
    this.client = null;
    this.collection = null;
    this.indexEnsured = false;
  }

  /**
   * Connects to Mongo lazily and hands back the collection once it's ready to use.
   * @returns {Promise<import("mongodb").Collection>}
   */
  async connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = (async () => {
        this.client = new MongoClient(this.uri);
        await this.client.connect();
        const db = this.client.db(this.dbName);
        this.collection = db.collection(this.collectionName);
        if (!this.indexEnsured) {
          await this.collection.createIndex({
            scope: 1,
            chatId: 1,
            createdAt: 1,
          });
          this.indexEnsured = true;
        }
        return this.collection;
      })().catch((err) => {
        this.connectionPromise = null;
        throw err;
      });
    }

    await this.connectionPromise;
    return this.collection;
  }

  /**
   * Closes the Mongo connection so we aren't hoarding sockets when the bot shuts down.
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.collection = null;
      this.connectionPromise = null;
      this.indexEnsured = false;
    }
  }

  /**
   * Pulls the latest chat messages for a scope so we can feed them back into the AI.
   * @param {string|number} chatId
   * @param {string} scope
   * @param {number} [limit]
   * @returns {Promise<Array<{role: string, content: string|Array|Record<string, any>}>>}
   */
  async getHistory(chatId, scope, limit = 10) {
    if (!chatId || !scope) return [];
    const collection = await this.connect();
    const normalizedChatId = String(chatId);
    const docs = await collection
      .find({ chatId: normalizedChatId, scope })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs
      .reverse()
      .map((doc) => ({ role: doc.role, content: doc.content }))
      .filter((entry) => entry.role && entry.content);
  }

  /**
   * Saves fresh AI/user messages and trims the history so it doesn't blow up forever.
   * @param {string|number} chatId
   * @param {string} scope
   * @param {Array<{role: string, content: string|Array|Record<string, any>}>} messages
   * @returns {Promise<void>}
   */
  async appendMessages(chatId, scope, messages = []) {
    if (
      !chatId ||
      !scope ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return;
    }
    const collection = await this.connect();
    const normalizedChatId = String(chatId);
    const docs = messages
      .filter((msg) => msg && msg.role && msg.content)
      .map((msg) => ({
        chatId: normalizedChatId,
        scope,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(),
      }));

    if (docs.length === 0) return;

    await collection.insertMany(docs, { ordered: false }).catch((error) => {
      console.error("[AI Memory] Failed to append messages:", error);
    });

    // Keep only the latest 40 exchanges per chat scope to avoid unbounded growth
    const maxEntries = 80;
    collection
      .aggregate([
        { $match: { chatId: normalizedChatId, scope } },
        { $sort: { createdAt: -1 } },
        { $skip: maxEntries },
        { $project: { _id: 1 } },
      ])
      .toArray()
      .then((staleDocs) => {
        if (staleDocs.length) {
          const ids = staleDocs.map((doc) => doc._id);
          collection.deleteMany({ _id: { $in: ids } }).catch((err) => {
            console.error("[AI Memory] Failed to trim history:", err);
          });
        }
      })
      .catch((err) => {
        console.error("[AI Memory] Failed to schedule trim:", err);
      });
  }

  /**
   * Nukes any remembered lines for a chat scope when someone wants a clean slate.
   * @param {string|number} chatId
   * @param {string} scope
   * @returns {Promise<void>}
   */
  async clearHistory(chatId, scope) {
    if (!chatId || !scope) return;
    const collection = await this.connect();
    await collection.deleteMany({ chatId: String(chatId), scope });
    console.log(`[AI Memory] History cleared for ${chatId} in scope ${scope}`);
  }
}

/**
 * Shared instance so most callers don't have to roll their own memory store.
 */
const sharedMemoryStore = new AiMemoryStore();

/**
 * High-level wrapper for firing prompts at OpenRouter while handling fallbacks.
 */
class Ai {
  /**
   * Spins up the AI helper with model preferences and request defaults.
   * @param {{
   *  model?: string,
   *  fallbackModels?: string[],
   *  temperature?: number,
   *  maxTokens?: number,
   *  defaultHeaders?: Record<string, string>,
   *  requestTimeoutMs?: number
   * }} [options]
   */
  constructor({
    model = "openrouter/polaris-alpha",
    fallbackModels = [],
    temperature = 0.7,
    maxTokens = 512,
    defaultHeaders = {},
    requestTimeoutMs = 20000,
  } = {}) {
    this.models = [model, ...fallbackModels].filter(Boolean);
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...defaultHeaders };
    this.clientCache = new Map();
    this.lastUsedModel = null;
    // Per-request timeout (ms) used when invoking each model. If a model
    // doesn't respond within this window we try the next configured model.
    // Default: 20000ms (20s). A value of 0 disables the timeout.
    this.requestTimeoutMs = Number(requestTimeoutMs) || 0;
  }

  /**
   * Converts mixed message content into a consistent array so we can tack on attachments.
   * @param {string|Array|undefined} content
   * @returns {Array}
   */
  ensureContentArray(content) {
    if (Array.isArray(content)) {
      return [...content];
    }
    if (typeof content === "string" && content.length) {
      return [{ type: "text", text: content }];
    }
    return [];
  }

  /**
   * Turns an attachment descriptor into a LangChain-friendly multimodal chunk.
   * @param {AiAttachment} attachment
   * @returns {Record<string, any>|null}
   */
  normalizeAttachment(attachment) {
    if (!attachment || !attachment.type) return null;
    const type = String(attachment.type).toLowerCase();
    const { url, data, mimeType, format } = attachment;

    if (type === "image") {
      if (url) {
        return { type: "image_url", image_url: { url } };
      }

      const dataUri = this.toDataUri(data, mimeType || "image/png");
      if (!dataUri) return null;
      return { type: "image_url", image_url: { url: dataUri } };
    }

    if (type === "video") {
      if (url) {
        return { type: "input_video", video: { url } };
      }

      const encoded = this.toBase64(data);
      if (!encoded) return null;
      const payload = { data: encoded };
      const resolvedFormat =
        format || (mimeType ? this.mimeTypeToFormat(mimeType) : undefined);
      if (resolvedFormat) {
        payload.format = resolvedFormat;
      }
      return { type: "input_video", video: payload };
    }

    return null;
  }

  /**
   * Converts incoming blobs into base64 so the API can ingest them inline.
   * @param {string|Buffer|undefined} data
   * @returns {string|null}
   */
  toBase64(data) {
    if (!data) return null;
    if (Buffer.isBuffer(data)) {
      return data.toString("base64");
    }
    if (typeof data === "string") {
      const trimmed = data.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("data:")) {
        const base64Part = trimmed.substring(trimmed.indexOf(",") + 1);
        return base64Part ? base64Part.trim() : null;
      }
      const base64Like = trimmed.replace(/\\s+/g, "");
      if (/^[A-Za-z0-9+/]+={0,2}$/.test(base64Like)) {
        return base64Like;
      }
      return Buffer.from(trimmed).toString("base64");
    }
    return null;
  }

  /**
   * Shapes data blobs into data URIs when the API expects them that way (mostly for images).
   * @param {string|Buffer|undefined} data
   * @param {string} mimeType
   * @returns {string|null}
   */
  toDataUri(data, mimeType) {
    if (!data) return null;
    if (typeof data === "string" && data.trim().startsWith("data:")) {
      return data.trim();
    }
    const encoded = this.toBase64(data);
    if (!encoded) return null;
    return `data:${mimeType};base64,${encoded}`;
  }

  /**
   * Attempts to turn a MIME type into a bare format string.
   * @param {string} mimeType
   * @returns {string|undefined}
   */
  mimeTypeToFormat(mimeType) {
    if (!mimeType) return undefined;
    const [, subtype] = mimeType.split("/");
    if (!subtype) return undefined;
    return subtype.split(";")[0] || undefined;
  }

  /**
   * Builds the outgoing user message and hands back a representation suitable for persistence.
   * @param {{ user?: any, attachments?: AiAttachment[] }} [options]
   * @returns {{ message: HumanMessage|null, contentForHistory: string|Array|Record<string, any>|null }}
   */
  buildUserMessagePayload({ user, attachments = [] } = {}) {
    const normalizedAttachments = Array.isArray(attachments)
      ? attachments
          .map((attachment) => this.normalizeAttachment(attachment))
          .filter(Boolean)
      : [];

    if (user instanceof HumanMessage) {
      if (!normalizedAttachments.length) {
        return { message: user, contentForHistory: user.content };
      }
      const contentPieces = this.ensureContentArray(user.content).concat(
        normalizedAttachments,
      );
      const rebuilt = new HumanMessage({
        content: contentPieces,
        additional_kwargs: user.additional_kwargs,
        name: user.name,
      });
      return { message: rebuilt, contentForHistory: contentPieces };
    }

    if (Array.isArray(user)) {
      const contentPieces = [...user, ...normalizedAttachments];
      if (!contentPieces.length) {
        return { message: null, contentForHistory: null };
      }
      return {
        message: new HumanMessage({ content: contentPieces }),
        contentForHistory: contentPieces,
      };
    }

    if (
      user &&
      typeof user === "object" &&
      user !== null &&
      "content" in user
    ) {
      const baseContent = this.ensureContentArray(user.content).concat(
        normalizedAttachments,
      );
      if (!baseContent.length) {
        return { message: null, contentForHistory: null };
      }
      return {
        message: new HumanMessage({
          ...user,
          content: baseContent,
        }),
        contentForHistory: baseContent,
      };
    }

    const trimmedUser = typeof user === "string" ? user : undefined;

    if (normalizedAttachments.length === 0) {
      if (typeof trimmedUser === "string" && trimmedUser.length) {
        return {
          message: new HumanMessage(trimmedUser),
          contentForHistory: trimmedUser,
        };
      }
      return { message: null, contentForHistory: null };
    }

    const contentPieces = [];
    if (typeof trimmedUser === "string" && trimmedUser.length) {
      contentPieces.push({ type: "text", text: trimmedUser });
    }
    contentPieces.push(...normalizedAttachments);

    if (!contentPieces.length) {
      return { message: null, contentForHistory: null };
    }

    return {
      message: new HumanMessage({ content: contentPieces }),
      contentForHistory: contentPieces,
    };
  }

  /**
   * Returns a cached LangChain client for the given model so we aren't rebuilding it each ask.
   * @param {string} model
   * @returns {import(\"@langchain/openai\").ChatOpenAI}
   */
  getClient(model) {
    if (!this.clientCache.has(model)) {
      const client = new ChatOpenAI({
        apiKey: config.openrouterKey || config.openrouter_key,
        model,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: this.defaultHeaders,
        },
      });
      this.clientCache.set(model, client);
    }
    return this.clientCache.get(model);
  }

  /**
   * Shapes the message payload so LangChain gets the context in the order it expects.
   * @param {{ system?: string, messages?: Array<import(\"@langchain/core/messages\").BaseMessage>, user?: any, attachments?: AiAttachment[] }} params
   * @returns {Array<import(\"@langchain/core/messages\").BaseMessage>}
   */
  buildMessages({ system, messages = [], user, attachments = [] }) {
    const payload = [];
    if (system) {
      payload.push(new SystemMessage(system));
    }
    if (messages.length) {
      payload.push(...messages);
    }
    const { message } = this.buildUserMessagePayload({ user, attachments });
    if (message) {
      payload.push(message);
    }
    return payload;
  }

  /**
   * Normalizes the AI response content into a clean string no matter the underlying format.
   * @param {import(\"@langchain/core/messages\").AIMessage | string | undefined} aiMessage
   * @returns {string}
   */
  extractText(aiMessage) {
    if (!aiMessage) return "";
    if (typeof aiMessage.content === "string") {
      return aiMessage.content;
    }
    if (Array.isArray(aiMessage.content)) {
      return aiMessage.content
        .map((chunk) => {
          if (typeof chunk === "string") return chunk;
          if (typeof chunk?.text === "string") return chunk.text;
          if (typeof chunk?.content === "string") return chunk.content;
          return "";
        })
        .join("\\n")
        .trim();
    }
    return "";
  }

  /**
   * Sends a prompt to the configured models, trying fallbacks until one answers.
   * @param {{ system?: string, user?: any, messages?: Array<import(\"@langchain/core/messages\").BaseMessage>, attachments?: AiAttachment[] }} [options]
   * @returns {Promise<string>}
   */
  async ask({ system, user, messages = [], attachments = [] } = {}) {
    if (!this.models.length) {
      throw new Error("No AI models configured");
    }

    let lastError;
    for (const model of this.models) {
      try {
        const client = this.getClient(model);
        // Build messages once for this invocation
        const builtMessages = this.buildMessages({
          system,
          user,
          messages,
          attachments,
        });

        // If a request timeout is configured (>0) race the invoke against a timer
        let response;
        if (this.requestTimeoutMs > 0) {
          let timer;
          const work = client.invoke(builtMessages).then((res) => {
            if (timer) clearTimeout(timer);
            return res;
          });

          const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => {
              reject(
                new Error(
                  `Model ${model} timed out after ${this.requestTimeoutMs}ms`,
                ),
              );
            }, this.requestTimeoutMs);
          });

          response = await Promise.race([work, timeoutPromise]);
        } else {
          response = await client.invoke(builtMessages);
        }

        const text = this.extractText(response)?.trim();
        if (!text) {
          throw new Error(`Empty response from ${model}`);
        }
        this.lastUsedModel = model;
        return text;
      } catch (error) {
        lastError = error;
        console.error(`[AI] ${model} failed:`, error?.message || error);
      }
    }

    throw lastError || new Error("All AI models failed");
  }
}

/**
 * AI helper that remembers per-chat history so replies can reference older messages.
 */
class AiWithHistory extends Ai {
  /**
   * Rehydrates stored content into something LangChain message constructors understand.
   * @param {string|Array|Record<string, any>} content
   * @returns {string|Record<string, any>}
   */
  formatStoredContent(content) {
    if (Array.isArray(content)) {
      return { content };
    }
    if (content && typeof content === "object" && "content" in content) {
      return content;
    }
    return content;
  }

  /**
   * Boots the AI helper while wiring in a memory store for contextual answers.
   * @param {{
   *  memoryStore?: AiMemoryStore,
   *  memoryScope?: string,
   *  historyLimit?: number
   * }} [options]
   */
  constructor({
    memoryStore = sharedMemoryStore,
    memoryScope = "default",
    historyLimit = 10,
    ...options
  } = {}) {
    super(options);
    this.memoryStore = memoryStore;
    this.memoryScope = memoryScope;
    this.historyLimit = historyLimit;
  }

  /**
   * Fetches chat history, asks the AI, and stores both the user and bot messages.
   * @param {string|number} chatId
   * @param {{ system?: string, user?: any, attachments?: AiAttachment[] }} [options]
   * @returns {Promise<string>}
   */
  async ask(chatId, { system, user, attachments = [] } = {}) {
    if (!chatId) {
      throw new Error("chatId is required for AiWithHistory");
    }

    const historyEntries = await this.memoryStore.getHistory(
      chatId,
      this.memoryScope,
      this.historyLimit,
    );

    const formattedHistory = historyEntries.map((entry) => {
      const payload = this.formatStoredContent(entry.content);
      return entry.role === "assistant"
        ? new AIMessage(payload)
        : new HumanMessage(payload);
    });

    const { contentForHistory } = this.buildUserMessagePayload({
      user,
      attachments,
    });

    const response = await super.ask({
      system,
      user,
      attachments,
      messages: formattedHistory,
    });

    const toPersist = [];
    if (contentForHistory !== null && contentForHistory !== undefined) {
      toPersist.push({ role: "user", content: contentForHistory });
    }
    if (response) toPersist.push({ role: "assistant", content: response });

    if (toPersist.length) {
      this.memoryStore
        .appendMessages(chatId, this.memoryScope, toPersist)
        .catch((err) => {
          console.error("[AI Memory] Failed to persist chat:", err);
        });
    }

    return response;
  }

  /**
   * Clears any stored memory for the chat so the AI forgets the convo trail.
   * @param {string|number} chatId
   * @returns {Promise<void>}
   */
  async clear(chatId) {
    await this.memoryStore.clearHistory(chatId, this.memoryScope);
  }
}

/**
 * Groq version of the Ai class.
 * Same constructor shape, same ask() behavior, fallbacks included.
 */
class GroqAi {
  constructor({
    model = "llama-3.1-70b-versatile",
    fallbackModels = [],
    temperature = 0.7,
    maxTokens = 512,
    requestTimeoutMs = 20000,
    apiKey = config.groqKey || config.groq_key,
  } = {}) {
    this.models = [model, ...fallbackModels].filter(Boolean);
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.requestTimeoutMs = Number(requestTimeoutMs) || 0;
    this.client = new Groq({ apiKey });
    this.lastUsedModel = null;
  }

  extractText(resp) {
    try {
      return resp.choices?.[0]?.message?.content?.trim() || "";
    } catch {
      return "";
    }
  }

  async ask({ system, user, messages = [], attachments = [] } = {}) {
    if (!this.models.length) throw new Error("No Groq models configured");

    const groqMessages = [];
    if (system) groqMessages.push({ role: "system", content: system });

    if (messages.length) {
      groqMessages.push(
        ...messages.map((m) => {
          // Handle plain objects that already have role/content
          if (m.role && m.content) {
            return {
              role: m.role,
              content:
                typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content),
            };
          }
          // Handle LangChain message objects
          if (typeof m._getType === "function") {
            return {
              role: m._getType() === "ai" ? "assistant" : "user",
              content:
                typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content),
            };
          }
          // Fallback for unknown format
          return {
            role: "user",
            content: JSON.stringify(m),
          };
        }),
      );
    }

    if (user) {
      const u =
        typeof user === "string"
          ? user
          : typeof user?.content === "string"
            ? user.content
            : JSON.stringify(user);
      groqMessages.push({ role: "user", content: u });
    }

    let lastError;
    for (const model of this.models) {
      try {
        const work = this.client.chat.completions.create({
          model,
          messages: groqMessages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        });

        const resp =
          this.requestTimeoutMs > 0
            ? await Promise.race([
                work,
                new Promise((_, reject) =>
                  setTimeout(
                    () =>
                      reject(
                        new Error(
                          `Model ${model} timed out after ${this.requestTimeoutMs}ms`,
                        ),
                      ),
                    this.requestTimeoutMs,
                  ),
                ),
              ])
            : await work;

        const text = this.extractText(resp);
        if (!text) throw new Error(`Empty response from ${model}`);

        this.lastUsedModel = model;
        return text;
      } catch (err) {
        lastError = err;
        console.error(`[GroqAI] ${model} failed:`, err?.message || err);
      }
    }

    throw lastError || new Error("All Groq models failed");
  }

  /**
   * Transcribes an audio file using Groq Whisper.
   * @param {Object} options
   * @param {string|Buffer|fs.ReadStream} options.file - Path, buffer, or stream
   * @param {string} [options.model=\"whisper-large-v3-turbo\"]
   * @param {number} [options.temperature=0]
   * @returns {Promise<string>}
   */
  async transcribe({
    file,
    model = "whisper-large-v3-turbo",
    temperature = 0,
  } = {}) {
    if (!file) throw new Error("file is required for GroqAi.transcribe");

    let input;
    if (typeof file === "string") {
      // path
      const fs = require("fs");
      input = fs.createReadStream(file);
    } else {
      // buffer or stream
      input = file;
    }

    try {
      const work = this.client.audio.transcriptions.create({
        file: input,
        model,
        temperature,
        response_format: "verbose_json",
      });

      const resp =
        this.requestTimeoutMs > 0
          ? await Promise.race([
              work,
              new Promise((_, reject) =>
                setTimeout(
                  () =>
                    reject(
                      new Error(
                        `Groq transcription timed out after ${this.requestTimeoutMs}ms`,
                      ),
                    ),
                  this.requestTimeoutMs,
                ),
              ),
            ])
          : await work;

      const text = resp?.text || "";
      if (!text) throw new Error("Groq transcription returned empty text");

      return text.trim();
    } catch (err) {
      console.error("[GroqAI] transcription failed:", err?.message || err);
      throw err;
    }
  }

  async tts(text, options = {}) {
    const voice = options.voice || "Fritz-PlayAI";
    const responseFormat = options.responseFormat || "wav";

    if (!text) throw new Error("text is required for GroqAi.tts");

    try {
      const work = this.client.audio.speech.create({
        model: "playai-tts",
        input: text,
        voice,
        response_format: responseFormat,
      });

      const resp =
        this.requestTimeoutMs > 0
          ? await Promise.race([
              work,
              new Promise((_, reject) =>
                setTimeout(
                  () =>
                    reject(
                      new Error(
                        `Groq TTS timed out after ${this.requestTimeoutMs}ms`,
                      ),
                    ),
                  this.requestTimeoutMs,
                ),
              ),
            ])
          : await work;

      if (!resp || typeof resp.arrayBuffer !== "function") {
        throw new Error("Groq TTS returned an unexpected response");
      }

      const arrayBuffer = await resp.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      console.error("[GroqAI] TTS failed:", err?.message || err);
      throw err;
    }
  }
}

/**
 * Groq version of AiWithHistory
 * Same API: ask(chatId, {...}), clear()
 */
class GroqAiWithHistory extends GroqAi {
  constructor({
    memoryStore = sharedMemoryStore,
    memoryScope = "default",
    historyLimit = 10,
    ...options
  } = {}) {
    super(options);
    this.memoryStore = memoryStore;
    this.memoryScope = memoryScope;
    this.historyLimit = historyLimit;
  }

  formatStoredContent(content) {
    if (Array.isArray(content)) return content.join("\\n");
    if (typeof content === "object" && content !== null) {
      return JSON.stringify(content);
    }
    return content;
  }

  async ask(chatId, { system, user } = {}) {
    if (!chatId) throw new Error("chatId is required for GroqAiWithHistory");

    const history = await this.memoryStore.getHistory(
      chatId,
      this.memoryScope,
      this.historyLimit,
    );

    const formattedHistory = history.map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: this.formatStoredContent(entry.content),
    }));

    const userContent =
      typeof user === "string"
        ? user
        : typeof user?.content === "string"
          ? user.content
          : JSON.stringify(user);

    const response = await super.ask({
      system,
      user: userContent,
      messages: formattedHistory,
    });

    const toPersist = [];
    if (userContent) {
      toPersist.push({ role: "user", content: userContent });
    }
    if (response) {
      toPersist.push({ role: "assistant", content: response });
    }

    if (toPersist.length) {
      this.memoryStore
        .appendMessages(chatId, this.memoryScope, toPersist)
        .catch((e) => {
          console.error("[Groq Memory] Failed to persist:", e);
        });
    }

    return response;
  }

  async clear(chatId) {
    await this.memoryStore.clearHistory(chatId, this.memoryScope);
  }
}

/**
 * Mistral version of the Ai class.
 * Same constructor shape, same ask() behavior, fallbacks included.
 */
class MistralAi {
  constructor({
    model = "mistral-small-latest",
    fallbackModels = [],
    temperature = 0.7,
    maxTokens = 512,
    requestTimeoutMs = 20000,
    apiKey = config.mistralKey || config.mistral_key,
  } = {}) {
    this.models = [model, ...fallbackModels].filter(Boolean);
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.requestTimeoutMs = Number(requestTimeoutMs) || 0;
    this.client = new Mistral({ apiKey });
    this.lastUsedModel = null;
  }

  extractText(resp) {
    try {
      return resp.choices?.[0]?.message?.content?.trim() || "";
    } catch {
      return "";
    }
  }

  async ask({ system, user, messages = [], attachments = [] } = {}) {
    if (!this.models.length) throw new Error("No Mistral models configured");

    const mistralMessages = [];
    if (system) mistralMessages.push({ role: "system", content: system });

    if (messages.length) {
      mistralMessages.push(
        ...messages.map((m) => {
          // Handle plain objects that already have role/content
          if (m.role && m.content) {
            return {
              role: m.role,
              content:
                typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content),
            };
          }
          // Handle LangChain message objects
          if (typeof m._getType === "function") {
            return {
              role: m._getType() === "ai" ? "assistant" : "user",
              content:
                typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content),
            };
          }
          // Fallback for unknown format
          return {
            role: "user",
            content: JSON.stringify(m),
          };
        }),
      );
    }

    if (user) {
      const u =
        typeof user === "string"
          ? user
          : typeof user?.content === "string"
            ? user.content
            : JSON.stringify(user);
      mistralMessages.push({ role: "user", content: u });
    }

    let lastError;
    for (const model of this.models) {
      try {
        const work = this.client.chat.complete({
          model,
          messages: mistralMessages,
          temperature: this.temperature,
          maxTokens: this.maxTokens,
        });

        const resp =
          this.requestTimeoutMs > 0
            ? await Promise.race([
                work,
                new Promise((_, reject) =>
                  setTimeout(
                    () =>
                      reject(
                        new Error(
                          `Model ${model} timed out after ${this.requestTimeoutMs}ms`,
                        ),
                      ),
                    this.requestTimeoutMs,
                  ),
                ),
              ])
            : await work;

        const text = this.extractText(resp);
        if (!text) throw new Error(`Empty response from ${model}`);

        this.lastUsedModel = model;
        return text;
      } catch (err) {
        lastError = err;
        console.error(`[MistralAI] ${model} failed:`, err?.message || err);
      }
    }

    throw lastError || new Error("All Mistral models failed");
  }

  async classify(
    inputs,
    { model = "mistral-moderation-latest", requestTimeoutMs } = {},
  ) {
    if (
      inputs == null ||
      (Array.isArray(inputs) && inputs.length === 0)
    ) {
      throw new Error("inputs is required for classify()");
    }

    const isArrayInput = Array.isArray(inputs);
    const normalizedInputs = isArrayInput ? inputs : [inputs];

    const timeout =
      requestTimeoutMs !== undefined
        ? Number(requestTimeoutMs)
        : Number(this.requestTimeoutMs) || 0;

    const work = this.client.classifiers.moderate({
      model,
      inputs: normalizedInputs,
    });

    const resp =
      timeout > 0
        ? await Promise.race([
            work,
            new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error(
                      `Moderation model ${model} timed out after ${timeout}ms`,
                    ),
                  ),
                timeout,
              ),
            ),
          ])
        : await work;

    const mapped = (resp.results || []).map((r) => ({
      categories: r.categories || {},
      scores: r.category_scores || {},
    }));

    // Single input → first item, multi-input → whole array
    return isArrayInput ? mapped : mapped[0] || { categories: {}, scores: {} };
  }

}

/**
 * Mistral version of AiWithHistory
 * Same API: ask(chatId, {...}), clear()
 */
class MistralAiWithHistory extends MistralAi {
  constructor({
    memoryStore = sharedMemoryStore,
    memoryScope = "default",
    historyLimit = 10,
    ...options
  } = {}) {
    super(options);
    this.memoryStore = memoryStore;
    this.memoryScope = memoryScope;
    this.historyLimit = historyLimit;
  }

  formatStoredContent(content) {
    if (Array.isArray(content)) return content.join("\n");
    if (typeof content === "object" && content !== null) {
      return JSON.stringify(content);
    }
    return content;
  }

  async ask(chatId, { system, user } = {}) {
    if (!chatId) throw new Error("chatId is required for MistralAiWithHistory");

    const history = await this.memoryStore.getHistory(
      chatId,
      this.memoryScope,
      this.historyLimit,
    );

    const formattedHistory = history.map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: this.formatStoredContent(entry.content),
    }));

    const userContent =
      typeof user === "string"
        ? user
        : typeof user?.content === "string"
          ? user.content
          : JSON.stringify(user);

    const response = await super.ask({
      system,
      user: userContent,
      messages: formattedHistory,
    });

    const toPersist = [];
    if (userContent) {
      toPersist.push({ role: "user", content: userContent });
    }
    if (response) {
      toPersist.push({ role: "assistant", content: response });
    }

    if (toPersist.length) {
      this.memoryStore
        .appendMessages(chatId, this.memoryScope, toPersist)
        .catch((e) => {
          console.error("[Mistral Memory] Failed to persist:", e);
        });
    }

    return response;
  }

  async clear(chatId) {
    await this.memoryStore.clearHistory(chatId, this.memoryScope);
  }
}

module.exports = { Ai, AiWithHistory, GroqAi, GroqAiWithHistory, MistralAi, MistralAiWithHistory };
