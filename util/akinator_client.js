const axios = require("axios");

const DEFAULT_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; SimpBot) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "X-Requested-With": "XMLHttpRequest",
};

const ANSWER_IDS = [
  "a_yes",
  "a_no",
  "a_dont_know",
  "a_probably",
  "a_probaly_not",
];

const decodeHtml = (text = "") => {
  let decoded = `${text}`;
  decoded = decoded.replace(/<br\s*\/?\s*>/gi, "\n");
  decoded = decoded.replace(/&nbsp;/gi, " ");
  decoded = decoded.replace(/&quot;/gi, '"');
  decoded = decoded.replace(/&#039;/gi, "'");
  decoded = decoded.replace(/&#39;/gi, "'");
  decoded = decoded.replace(/&ldquo;|&rdquo;/gi, '"');
  decoded = decoded.replace(/&lsquo;|&rsquo;/gi, "'");
  decoded = decoded.replace(/&amp;/gi, "&");
  decoded = decoded.replace(/&lt;/gi, "<");
  decoded = decoded.replace(/&gt;/gi, ">");
  decoded = decoded.replace(/&eacute;/gi, "é");
  decoded = decoded.replace(/&egrave;/gi, "è");
  decoded = decoded.replace(/&euml;/gi, "ë");
  decoded = decoded.replace(/&ccedil;/gi, "ç");
  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCodePoint(Number(code)),
  );
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCodePoint(parseInt(code, 16)),
  );
  decoded = decoded.replace(/<\/?[^>]+>/g, "");
  return decoded.trim();
};

const toAnswersArray = (answers) => {
  if (!Array.isArray(answers)) {
    return [];
  }

  return answers
    .map((answer) => {
      if (typeof answer === "string") {
        return decodeHtml(answer);
      }
      if (answer && typeof answer === "object" && answer.answer) {
        return decodeHtml(answer.answer);
      }
      return null;
    })
    .filter(Boolean);
};

const buildFormBody = (payload) => {
  const form = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    form.append(key, String(value));
  });
  return form.toString();
};

const normalizeConfidence = (value) => {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  const percent = numeric > 1 ? numeric : numeric * 100;
  const bounded = Math.min(Math.max(percent, 0), 100);
  return Math.round(bounded * 10) / 10;
};

class AkinatorWebClient {
  constructor({ region = "en", childMode = false } = {}) {
    this.region = region;
    this.childMode = childMode === true;
    this.baseUrl = `https://${this.region}.akinator.com`;
    this.headers = {
      ...DEFAULT_HEADERS,
      Referer: `${this.baseUrl}/`,
    };

    this.session = undefined;
    this.signature = undefined;
    this.question = undefined;
    this.answers = [];
    this.progress = 0;
    this.currentStep = 0;
    this.lastPropositionId = "";
    this.guessCount = 0;
  }

  async start() {
    const html = await this.#postForHtml("/game", {
      sid: 1,
      cm: this.childMode ? 1 : 0,
    });

    this.session = this.#extract(html, /session:\s*'([^']+)'/i);
    this.signature = this.#extract(html, /signature:\s*'([^']+)'/i);
    const rawQuestion = this.#extract(
      html,
      /<p class="question-text"[^>]*>([\s\S]+?)<\/p>/i,
    );
    this.question = decodeHtml(rawQuestion);
    this.answers = ANSWER_IDS.map((id) =>
      decodeHtml(
        this.#extract(
          html,
          new RegExp(`<a[^>]+id="${id}"[^>]*>([\\s\\S]+?)<\\/a>`, "i"),
        ),
      ),
    ).filter(Boolean);

    if (!this.session || !this.signature || !this.question) {
      throw new Error("Failed to initialize Akinator session.");
    }

    if (this.answers.length === 0) {
      this.answers = ["Yes", "No", "Don't know", "Probably", "Probably not"];
    }

    this.progress = 0;
    this.currentStep = 0;

    return this.#currentState();
  }

  async answer(answerIndex) {
    if (typeof answerIndex !== "number" || Number.isNaN(answerIndex)) {
      throw new Error("Answer index must be a number.");
    }
    if (answerIndex < 0 || answerIndex > 4) {
      throw new Error("Answer index out of range.");
    }

    const response = await this.#postForJson("/answer", {
      step: this.currentStep,
      progression: this.progress,
      sid: 1,
      cm: this.childMode ? 1 : 0,
      answer: answerIndex,
      step_last_proposition: this.lastPropositionId,
      session: this.session,
      signature: this.signature,
    });

    if (!response) {
      throw new Error("Empty response from Akinator.");
    }

    if (response.id_base_proposition) {
      this.guessCount += 1;
      this.lastPropositionId = response.id_base_proposition;
      return {
        guess: {
          id: response.id_base_proposition,
          name: decodeHtml(response.name_proposition || response.name || ""),
          description: decodeHtml(
            response.description_proposition || response.description || "",
          ),
          confidence: normalizeConfidence(response.proba || response.probability),
          image: response.photo || response.photo_path || null,
        },
      };
    }

    const answers = toAnswersArray(response.answers);
    if (answers.length) {
      this.answers = answers;
    }

    const nextStep = Number.parseInt(response.step, 10);
    const nextProgress = Number.parseFloat(response.progression);
    this.currentStep = Number.isNaN(nextStep) ? this.currentStep : nextStep;
    this.progress = Number.isNaN(nextProgress) ? this.progress : nextProgress;
    this.question = decodeHtml(response.question || "");

    return { state: this.#currentState() };
  }

  #currentState() {
    return {
      question: this.question,
      answers: this.answers.slice(0, 5),
      progress: this.progress,
      step: this.currentStep,
    };
  }

  async #postForHtml(path, payload) {
    const body = buildFormBody(payload);
    const { data } = await axios.post(`${this.baseUrl}${path}`, body, {
      headers: {
        ...this.headers,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (typeof data !== "string") {
      throw new Error("Unexpected response while starting Akinator session.");
    }
    return data;
  }

  async #postForJson(path, payload) {
    const body = buildFormBody(payload);
    const { data } = await axios.post(`${this.baseUrl}${path}`, body, {
      headers: this.headers,
    });

    if (!data) {
      return null;
    }

    let parsed = data;
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch (error) {
        throw new Error("Received malformed JSON from Akinator.");
      }
    }

    if (parsed.completion && parsed.completion !== "OK") {
      throw new Error(`Akinator responded with ${parsed.completion}`);
    }

    return parsed;
  }

  #extract(source, pattern) {
    if (!source) {
      return "";
    }
    const match = source.match(pattern);
    if (!match || !match[1]) {
      return "";
    }
    return match[1].trim();
  }
}

module.exports = {
  AkinatorWebClient,
  decodeHtml,
};
