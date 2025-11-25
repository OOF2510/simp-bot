const { MongoClient } = require("mongodb");
const config = require("../config.json");

const sanitizeTriviaAnswers = (answers) => {
  if (!answers || typeof answers !== "object") {
    return {};
  }

  return Object.entries(answers).reduce((questionAcc, [questionKey, value]) => {
    if (!value || typeof value !== "object") {
      questionAcc[questionKey] = {};
      return questionAcc;
    }

    const userEntries = Object.entries(value).reduce((userAcc, [userKey, entry]) => {
      if (entry && typeof entry === "object") {
        userAcc[userKey] = {
          userId: entry.userId ?? userKey,
          displayName: entry.displayName ?? null,
          answer: entry.answer ?? null,
          isCorrect: entry.isCorrect === true,
          timestamp:
            entry.timestamp instanceof Date
              ? entry.timestamp.toISOString()
              : typeof entry.timestamp === "string"
              ? entry.timestamp
              : null,
          optionIndex:
            typeof entry.optionIndex === "number" && Number.isFinite(entry.optionIndex)
              ? entry.optionIndex
              : entry.optionIndex === null
              ? null
              : undefined,
        };
      }
      return userAcc;
    }, {});

    questionAcc[questionKey] = userEntries;
    return questionAcc;
  }, {});
};

class GameSessionStore {
  constructor({ client = null, db = null } = {}) {
    const mongodbConfig = config.mongodb || {};
    this.uri = mongodbConfig.url;
    this.dbName = mongodbConfig.database;
    this.geoCollectionName = "geoguess_sessions";
    this.akiCollectionName = "akinator_sessions";
    this.triviaCollectionName = "trivia_sessions";
    this.connectionPromise = null;
    this.client = client;
    this.db = db;
    this.geoCollection = null;
    this.akiCollection = null;
    this.triviaCollection = null;
  }

  get enabled() {
    return Boolean((this.client || this.uri) && this.dbName);
  }

  async connect() {
    if (!this.enabled) {
      throw new Error("MongoDB connection details missing for session store");
    }

    if (!this.connectionPromise) {
      this.connectionPromise = (async () => {
        if (!this.client) {
          this.client = new MongoClient(this.uri);
          await this.client.connect();
        }
        if (!this.db) {
          this.db = this.client.db(this.dbName);
        }
        this.geoCollection = this.db.collection(this.geoCollectionName);
        this.akiCollection = this.db.collection(this.akiCollectionName);
        this.triviaCollection = this.db.collection(this.triviaCollectionName);
        return this.db;
      })().catch((error) => {
        this.connectionPromise = null;
        throw error;
      });
    }

    await this.connectionPromise;
    return this.db;
  }

  async disconnect() {
    if (this.client && this.uri && this.client.close) {
      await this.client.close();
    }
    this.client = null;
    this.db = null;
    this.geoCollection = null;
    this.akiCollection = null;
    this.triviaCollection = null;
    this.connectionPromise = null;
    console.log("GameSessionStore disconnected from MongoDB");
  }

  // GeoGuess
  async listGeoSessions() {
    if (!this.enabled) return [];
    await this.connect();
    return this.geoCollection.find({}).toArray();
  }

  async upsertGeoSession(session) {
    if (!this.enabled) return null;
    if (!session || typeof session.photoMessageId !== "number") {
      throw new Error("Invalid GeoGuess session payload");
    }

    await this.connect();
    const now = new Date();
    const filter = { photoMessageId: session.photoMessageId };
    const update = {
      $set: {
        sessionId: session.sessionId || null,
        chatId: session.chatId ?? null,
        country: session.country ?? null,
        countryCode: session.countryCode ?? null,
        displayName: session.displayName ?? null,
        coord: session.coord ?? null,
        guessCount: session.guessCount ?? 0,
        incorrectGuesses: Array.isArray(session.incorrectGuesses)
          ? session.incorrectGuesses
          : [],
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    };

    return this.geoCollection.updateOne(filter, update, { upsert: true });
  }

  async deleteGeoSession(photoMessageId) {
    if (!this.enabled) return null;
    await this.connect();
    return this.geoCollection.deleteOne({ photoMessageId });
  }

  // Akinator
  async listAkinatorSessions() {
    if (!this.enabled) return [];
    await this.connect();
    return this.akiCollection.find({}).toArray();
  }

  async upsertAkinatorSession(session) {
    if (!this.enabled) return null;
    if (!session || (!session.chatId && !session.channelId)) {
      throw new Error("Invalid Akinator session payload");
    }

    await this.connect();
    const now = new Date();
    const filter = { sessionId: session.sessionId };
    const update = {
      $set: {
        sessionId: session.sessionId,
        chatId: session.chatId ?? null,
        channelId: session.channelId ?? null,
        guildId: session.guildId ?? null,
        userId: session.userId ?? null,
        region: session.region || "en",
        childMode: session.childMode === true,
        status: session.status,
        question: session.question || null,
        confirmation: session.confirmation || null,
        akinatorState: session.akinatorState || null,
        guess: session.guess || null,
        messageId: session.messageId || null,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    };

    return this.akiCollection.updateOne(filter, update, { upsert: true });
  }

  async deleteAkinatorSession(sessionId) {
    if (!this.enabled) return null;
    await this.connect();
    return this.akiCollection.deleteOne({ sessionId });
  }

  // Trivia
  async listTriviaSessions() {
    if (!this.enabled) return [];
    await this.connect();
    return this.triviaCollection.find({}).toArray();
  }

  async upsertTriviaSession(session) {
    if (!this.enabled) return null;
    if (!session || (!session.chatId && !session.channelId)) {
      throw new Error("Invalid Trivia session payload");
    }

    await this.connect();
    const now = new Date();
    const filter = { sessionId: session.sessionId };
    const update = {
      $set: {
        sessionId: session.sessionId,
        chatId: session.chatId ?? null,
        channelId: session.channelId ?? null,
        guildId: session.guildId ?? null,
        userId: session.userId ?? null,
        stage: session.stage || "awaiting_category",
        categorySlug: session.categorySlug || null,
        categoryName: session.categoryName || null,
        categoryQuery: session.categoryQuery || null,
        questionCount:
          typeof session.questionCount === "number" ? session.questionCount : null,
        mode: session.mode || null,
        questions: Array.isArray(session.questions) ? session.questions : [],
        currentQuestionIndex:
          typeof session.currentQuestionIndex === "number"
            ? session.currentQuestionIndex
            : -1,
        answers: sanitizeTriviaAnswers(session.answers),
        scoreboard: session.scoreboard || {},
        selectionMessageId:
          typeof session.selectionMessageId === "number"
            ? session.selectionMessageId
            : null,
        activeMessageId:
          typeof session.activeMessageId === "number"
            ? session.activeMessageId
            : null,
        questionDeadline: session.questionDeadline || null,
        questionTimeLimitMs:
          typeof session.questionTimeLimitMs === "number"
            ? session.questionTimeLimitMs
            : null,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    };

    return this.triviaCollection.updateOne(filter, update, { upsert: true });
  }

  async deleteTriviaSession(sessionId) {
    if (!this.enabled) return null;
    await this.connect();
    return this.triviaCollection.deleteOne({ sessionId });
  }
}

module.exports = GameSessionStore;
