const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const axios = require("axios");
const he = require("he");
const { randomUUID } = require("crypto");

const CATEGORY_ENDPOINT = "https://the-trivia-api.com/api/categories";
const QUESTION_ENDPOINT = "https://the-trivia-api.com/api/questions";
const MODES = {
  MULTIPLE_CHOICE: "multiple_choice",
  OPEN_ENDED: "open_ended",
};
const QUESTION_COUNTS = [1, 5, 10, 15, 20];
const QUESTION_TIMER_OPTIONS = [10, 20, 30, 45, 60];
const DEFAULT_TIME_LIMIT = 45 * 1000;

const sessions = new Map(); // sessionId -> session
const sessionsByChannel = new Map(); // channelId -> sessionId
const timers = new Map(); // sessionId -> timeout

const decodeText = (value = "") => {
  if (!value) return "";
  try {
    return he.decode(value);
  } catch {
    return value;
  }
};

const shuffleArray = (input = []) => {
  const array = Array.isArray(input) ? input.slice() : [];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const normalizeAnswer = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const topCategoriesFromMap = (categoriesMap) =>
  Array.from(categoriesMap.entries())
    .slice(0, 24)
    .map(([slug, name]) => ({ label: name, value: slug }));

async function fetchCategories() {
  const { data } = await axios.get(CATEGORY_ENDPOINT);
  const entries = [];
  Object.entries(data || {}).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((sub) => entries.push([sub.toLowerCase(), sub]));
    } else {
      entries.push([name.toLowerCase(), name]);
    }
  });
  return new Map(entries);
}

async function fetchQuestions({ categorySlug, count }) {
  const params = { limit: count };
  if (categorySlug) params.categories = categorySlug;
  const { data } = await axios.get(QUESTION_ENDPOINT, { params, timeout: 10000 });
  return (data || []).map((q) => {
    const prompt = decodeText(q.question);
    const correctAnswer = decodeText(q.correctAnswer);
    const incorrectAnswers = Array.isArray(q.incorrectAnswers)
      ? q.incorrectAnswers.map(decodeText)
      : [];
    const options = shuffleArray([correctAnswer, ...incorrectAnswers]).slice(0, 4);
    return {
      prompt,
      correctAnswer,
      incorrectAnswers,
      options,
      category: decodeText(q.category),
      type: q.type,
    };
  });
}

const makeCategorySelect = (sessionId, categories) => {
  const options = topCategoriesFromMap(categories);
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|category`)
    .setPlaceholder("Select a category")
    .addOptions(options);
  return [
    new ActionRowBuilder().addComponents(menu),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|cancel`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    ),
  ];
};

const makeCountSelect = (sessionId) => {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|count`)
    .setPlaceholder("How many questions?")
    .addOptions(
      QUESTION_COUNTS.map((c) => ({
        label: `${c} question${c > 1 ? "s" : ""}`,
        value: String(c),
      })),
    );
  return [
    new ActionRowBuilder().addComponents(menu),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|back|category`)
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|cancel`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    ),
  ];
};

const makeModeSelect = (sessionId) => {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|mode`)
    .setPlaceholder("Pick a mode")
    .addOptions(
      {
        label: "Multiple Choice",
        value: MODES.MULTIPLE_CHOICE,
        description: "Buttons for answers",
      },
      {
        label: "Open Ended",
        value: MODES.OPEN_ENDED,
        description: "Type your answer",
      },
    );
  return [
    new ActionRowBuilder().addComponents(menu),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|back|count`)
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|cancel`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    ),
  ];
};

const makeTimerSelect = (sessionId) => {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|timer`)
    .setPlaceholder("Time per question")
    .addOptions(
      QUESTION_TIMER_OPTIONS.map((sec) => ({
        label: `${sec}s`,
        value: String(sec),
      })),
    );
  return [
    new ActionRowBuilder().addComponents(menu),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|back|mode`)
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|cancel`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    ),
  ];
};

const makeAnswerButtons = (sessionId, answers) => {
  const row = new ActionRowBuilder();
  answers.forEach((a, idx) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`triv|${sessionId}|answer|${idx}`)
        .setLabel(a)
        .setStyle(ButtonStyle.Primary),
    );
  });
  return [row];
};

const makeOpenAnswerButtons = (sessionId) => [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`triv|${sessionId}|open`)
      .setLabel("Answer")
      .setStyle(ButtonStyle.Primary),
  ),
];

const formatScoreboard = (scoreboard) => {
  const entries = Object.entries(scoreboard || {}).sort((a, b) => b[1].correct - a[1].correct);
  if (!entries.length) return "No points yet.";
  return entries.map(([userId, entry]) => `<@${userId}>: **${entry.correct}**`).join("\n");
};

const formatAnswers = (session, questionIndex) => {
  const answers = Object.values(session.answers?.[questionIndex] || {});
  if (!answers.length) return "Nobody yet.";
  const sorted = answers
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return sorted
    .map((entry) => {
      const cleaned =
        typeof entry.answer === "string"
          ? entry.answer.replace(/\s+/g, " ").trim()
          : `${entry.answer}`;
      const label =
        session.mode === MODES.MULTIPLE_CHOICE
          ? `locked in ${cleaned || "(blank)"}`
          : `answered "${cleaned || "(blank)"}"`;
      return `• ${entry.displayName} ${label}`;
    })
    .join("\n");
};

const questionEmbed = (session, questionIndex) => {
  const question = session.questions[questionIndex];
  const embed = new EmbedBuilder()
    .setTitle(`Trivia (${questionIndex + 1}/${session.questions.length})`)
    .setDescription(question.prompt)
    .setColor(0x9b59b6);

  const timeLimitSeconds = Math.max(
    1,
    Math.round((session.questionTimeLimitMs || DEFAULT_TIME_LIMIT) / 1000),
  );

  embed.addFields(
    {
      name: "Category",
      value: question.category || "General",
      inline: true,
    },
    {
      name: "Mode",
      value: session.mode === MODES.MULTIPLE_CHOICE ? "Multiple choice" : "Open ended",
      inline: true,
    },
    {
      name: "Time",
      value: `${timeLimitSeconds}s`,
      inline: true,
    },
    {
      name: "Scoreboard",
      value: formatScoreboard(session.scoreboard),
    },
    {
      name: "Answers so far",
      value: formatAnswers(session, questionIndex),
    },
  );

  return embed;
};

const summaryEmbed = (session, questionIndex, reason) => {
  const question = session.questions[questionIndex];
  const answers = Object.values(session.answers?.[questionIndex] || {});
  const winners = answers.filter((entry) => entry.isCorrect);

  const embed = new EmbedBuilder()
    .setTitle(`Q${questionIndex + 1} Results (${session.mode === MODES.MULTIPLE_CHOICE ? "Multiple choice" : "Open ended"})`)
    .setDescription(
      `${reason === "timeout" ? "⏱️ Time's up!" : "🎉 Round ended!"}\nCorrect answer: **${question.correctAnswer}**`,
    )
    .setColor(winners.length ? 0x2ecc71 : 0xe67e22);

  if (answers.length) {
    embed.addFields({
      name: "Guesses",
      value: answers
        .map(
          (entry) =>
            `${entry.isCorrect ? "✅" : "❌"} ${entry.displayName}: ${entry.answer || "(blank)"}`,
        )
        .join("\n")
        .slice(0, 1024),
    });
  } else {
    embed.addFields({ name: "Guesses", value: "Nobody answered." });
  }

  embed.addFields({ name: "Scoreboard", value: formatScoreboard(session.scoreboard) });
  return embed;
};

function clearTimer(sessionId) {
  const t = timers.get(sessionId);
  if (t) clearTimeout(t);
  timers.delete(sessionId);
}

async function persistSession(store, session) {
  if (!store?.enabled) return;
  await store.upsertTriviaSession(session);
}

async function removeSession(store, sessionId) {
  const session = sessions.get(sessionId);
  sessions.delete(sessionId);
  clearTimer(sessionId);
  if (session?.channelId) {
    sessionsByChannel.delete(session.channelId);
  }
  if (store?.enabled) {
    await store.deleteTriviaSession(sessionId);
  }
}

async function finishGame(client, session, store) {
  clearTimer(session.sessionId);
  const embed = new EmbedBuilder()
    .setTitle("Trivia Finished!")
    .setDescription(
      `Category: ${session.categoryName}\nMode: ${
        session.mode === MODES.MULTIPLE_CHOICE ? "Multiple choice" : "Open ended"
      }`,
    )
    .addFields({ name: "Final Scores", value: formatScoreboard(session.scoreboard) })
    .setColor(0x2ecc71);

  try {
    const channel = await client.channels.fetch(session.channelId);
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Failed to send trivia summary:", error);
  }

  await removeSession(store, session.sessionId);
}

async function scheduleTimer(client, session, store) {
  clearTimer(session.sessionId);
  const limit = session.questionTimeLimitMs || DEFAULT_TIME_LIMIT;
  session.questionDeadline = Date.now() + limit;
  const timeout = setTimeout(() => {
    finalizeQuestion(client, session.sessionId, store, "timeout").catch((e) =>
      console.error("Trivia timer error:", e),
    );
  }, limit);
  timers.set(session.sessionId, timeout);
}

async function updateQuestionMessage(client, session) {
  const questionIndex = session.currentQuestionIndex;
  if (questionIndex < 0 || !session.questions[questionIndex]) return;
  if (!session.activeMessageId) return;
  try {
    const channel = await client.channels.fetch(session.channelId);
    const components =
      session.mode === MODES.MULTIPLE_CHOICE
        ? makeAnswerButtons(session.sessionId, session.questions[questionIndex].options)
        : makeOpenAnswerButtons(session.sessionId);
    await channel.messages.edit(session.activeMessageId, {
      embeds: [questionEmbed(session, questionIndex)],
      components,
    });
  } catch (error) {
    console.error("Failed to refresh trivia question message:", error);
  }
}

async function finalizeQuestion(client, sessionId, store, reason = "timeout") {
  const session = sessions.get(sessionId);
  if (!session) return;
  if (session.currentQuestionIndex < 0) return;

  clearTimer(sessionId);

  const questionIndex = session.currentQuestionIndex;
  const answers = session.answers?.[questionIndex] || {};
  const answerList = Object.values(answers);
  const winners = answerList.filter((entry) => entry.isCorrect);

  winners.forEach((entry) => {
    const existing = session.scoreboard[entry.userId] || { correct: 0, name: entry.displayName };
    existing.correct += 1;
    existing.name = entry.displayName;
    session.scoreboard[entry.userId] = existing;
  });

  try {
    const channel = await client.channels.fetch(session.channelId);
    await channel.messages.edit(session.activeMessageId, {
      embeds: [summaryEmbed(session, questionIndex, reason)],
      components: [],
    });
  } catch (error) {
    console.error("Failed to edit trivia message with summary:", error);
  }

  await persistSession(store, session);

  setTimeout(() => {
    askNextQuestion(client, session, store).catch((err) =>
      console.error("Failed to ask next trivia question:", err),
    );
  }, 1500).unref?.();
}

async function askNextQuestion(client, session, store, options = {}) {
  clearTimer(session.sessionId);

  session.currentQuestionIndex += 1;
  const questionIndex = session.currentQuestionIndex;

  if (questionIndex >= session.questions.length) {
    await finishGame(client, session, store);
    return;
  }

  session.answers[questionIndex] = {};
  const question = session.questions[questionIndex];
  const components =
    session.mode === MODES.MULTIPLE_CHOICE
      ? makeAnswerButtons(session.sessionId, question.options)
      : makeOpenAnswerButtons(session.sessionId);

  try {
    let msg;
    if (options.initialInteraction) {
      msg = await options.initialInteraction.followUp({
        embeds: [questionEmbed(session, questionIndex)],
        components,
      });
    } else {
      const channel = await client.channels.fetch(session.channelId);
      msg = await channel.send({
        embeds: [questionEmbed(session, questionIndex)],
        components,
      });
    }
    session.activeMessageId = msg.id;
    session.stage = "asking";
    await persistSession(store, session);
    await scheduleTimer(client, session, store);
  } catch (error) {
    console.error("Failed to send trivia question:", error);
    await removeSession(store, session.sessionId);
  }
}

async function loadSessions(store, client) {
  if (!store?.enabled) return;
  const saved = await store.listTriviaSessions();
  saved.forEach((doc) => {
    if (!doc.sessionId || !doc.channelId) return;
    const session = {
      ...doc,
      sessionId: doc.sessionId,
      channelId: doc.channelId,
      guildId: doc.guildId,
      userId: doc.userId,
      stage: doc.stage || "awaiting_category",
      scoreboard: doc.scoreboard || {},
      answers: doc.answers || {},
      questions: Array.isArray(doc.questions) ? doc.questions : [],
      currentQuestionIndex:
        typeof doc.currentQuestionIndex === "number" ? doc.currentQuestionIndex : -1,
      questionTimeLimitMs: doc.questionTimeLimitMs || DEFAULT_TIME_LIMIT,
      questionDeadline: doc.questionDeadline
        ? new Date(doc.questionDeadline).getTime()
        : null,
      activeMessageId:
        typeof doc.activeMessageId === "string" ? doc.activeMessageId : doc.activeMessageId || null,
      selectionMessageId: doc.selectionMessageId || null,
    };
    sessions.set(session.sessionId, session);
    sessionsByChannel.set(session.channelId, session.sessionId);
  });

  for (const session of sessions.values()) {
    if (session.stage === "asking" && session.questions.length) {
      session.currentQuestionIndex = Math.max(
        Math.min(session.currentQuestionIndex, session.questions.length - 1) - 1,
        -1,
      );
      session.answers = {};
      session.activeMessageId = null;
      session.questionDeadline = null;
      try {
        const channel = await client.channels.fetch(session.channelId);
        await channel
          .send("♻️ Trivia game resumed after restart. Replaying the current question.")
          .catch(() => {});
      } catch (error) {
        console.error("Failed to notify trivia resume:", error);
      }
      await askNextQuestion(client, session, store, { resume: true });
    } else if (
      session.stage === "awaiting_category" ||
      session.stage === "awaiting_count" ||
      session.stage === "awaiting_mode" ||
      session.stage === "awaiting_timer"
    ) {
      await removeSession(store, session.sessionId);
    }
  }
}

async function handleAnswer(interaction, session, store, answerText) {
  const question = session.questions[session.currentQuestionIndex];
  if (!question) {
    await interaction.reply({ content: "Game already ended.", ephemeral: true });
    await removeSession(store, session.sessionId);
    return;
  }

  if (session.stage !== "asking" || session.currentQuestionIndex < 0) {
    return interaction.reply({ content: "This round isn't accepting answers right now.", ephemeral: true });
  }

  if (session.activeMessageId && interaction.message?.id && interaction.message.id !== session.activeMessageId) {
    return interaction.reply({ content: "That question already moved on.", ephemeral: true });
  }

  const questionIndex = session.currentQuestionIndex;
  const userId = interaction.user.id;

  session.answers[questionIndex] = session.answers[questionIndex] || {};
  if (session.answers[questionIndex][userId]) {
    return interaction.reply({ content: "You already answered this one.", ephemeral: true });
  }

  const entry = {
    userId,
    displayName: interaction.member?.displayName || interaction.user.username,
    answer: answerText,
    optionIndex: null,
    isCorrect: false,
    timestamp: new Date().toISOString(),
  };

  if (session.mode === MODES.MULTIPLE_CHOICE) {
    const idx = Number.parseInt(answerText, 10);
    const choice = question.options?.[idx];
    if (!choice) {
      return interaction.reply({ content: "Invalid choice.", ephemeral: true });
    }
    entry.answer = choice;
    entry.optionIndex = idx;
    entry.isCorrect = normalizeAnswer(choice) === normalizeAnswer(question.correctAnswer);
    session.answers[questionIndex][userId] = entry;
    await interaction.reply({ content: "Answer locked in!", ephemeral: true });
    await persistSession(store, session);
    await updateQuestionMessage(interaction.client, session);
    return;
  }

  const cleaned = normalizeAnswer(answerText);
  const correct = normalizeAnswer(question.correctAnswer);
  entry.isCorrect =
    cleaned === correct || (cleaned.length >= 4 && correct.includes(cleaned));
  session.answers[questionIndex][userId] = entry;
  await interaction.reply({ content: entry.isCorrect ? "Correct! 🎉" : "Locked in.", ephemeral: true });
  await persistSession(store, session);
  await updateQuestionMessage(interaction.client, session);
}

module.exports = {
  data: new SlashCommandBuilder().setName("trivia").setDescription("Play trivia together"),
  async execute(interaction, client, config, dbContext) {
    const { gameSessionStore } = dbContext;
    const existingId = sessionsByChannel.get(interaction.channelId);
    if (existingId) {
      const existing = sessions.get(existingId);
      if (existing && existing.stage === "asking") {
        return interaction.reply({
          content: "There's already a trivia game here. Finish that one first.",
          ephemeral: true,
        });
      }
    }

    const sessionId = randomUUID();
    const categories = await fetchCategories().catch(() => null);
    if (!categories) {
      return interaction.reply({
        content: "Could not load categories. Try again later.",
        ephemeral: true,
      });
    }

    const session = {
      sessionId,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      stage: "awaiting_category",
      scoreboard: {},
      questions: [],
      answers: {},
      currentQuestionIndex: -1,
      questionTimeLimitMs: DEFAULT_TIME_LIMIT,
    };

    sessions.set(sessionId, session);
    sessionsByChannel.set(interaction.channelId, sessionId);

    const msg = await interaction.reply({
      content: "Select a category to start Trivia.",
      components: makeCategorySelect(sessionId, categories),
    });

    session.selectionMessageId = msg.id;
    await persistSession(gameSessionStore, session);
  },
  async handleComponent(interaction, { gameSessionStore }) {
    const parts = interaction.customId.split("|");
    if (parts[0] !== "triv") return;
    const sessionId = parts[1];
    const action = parts[2];
    const extra = parts[3];
    const session = sessions.get(sessionId);
    if (!session) {
      return interaction.reply({ content: "This trivia game ended.", ephemeral: true });
    }
    if (session.channelId !== interaction.channelId) {
      return interaction.reply({
        content: "This control isn't for this channel.",
        ephemeral: true,
      });
    }
    const isOwner = interaction.user.id === session.userId;

    if (
      ["category", "count", "mode", "timer", "back", "cancel"].includes(action) &&
      !isOwner
    ) {
      return interaction.reply({
        content: "Only the host can configure the game.",
        ephemeral: true,
      });
    }

    if (action === "cancel") {
      await interaction.update({
        content: "Trivia cancelled.",
        components: [],
      });
      await removeSession(gameSessionStore, sessionId);
      return;
    }

    if (action === "back") {
      if (extra === "category") {
        session.stage = "awaiting_category";
        session.categorySlug = null;
        session.categoryName = null;
        session.questionCount = null;
        session.mode = null;
        session.questionTimeLimitMs = DEFAULT_TIME_LIMIT;
        const categories = await fetchCategories().catch(() => new Map());
        await interaction.update({
          content: "Select a category to start Trivia.",
          components: makeCategorySelect(sessionId, categories),
        });
        await persistSession(gameSessionStore, session);
        return;
      }
      if (extra === "count") {
        session.stage = "awaiting_count";
        session.questionCount = null;
        session.mode = null;
        session.questionTimeLimitMs = DEFAULT_TIME_LIMIT;
        await interaction.update({
          content: `Category: **${session.categoryName}**\nHow many questions?`,
          components: makeCountSelect(sessionId),
        });
        await persistSession(gameSessionStore, session);
        return;
      }
      if (extra === "mode") {
        session.stage = "awaiting_mode";
        session.mode = null;
        session.questionTimeLimitMs = DEFAULT_TIME_LIMIT;
        await interaction.update({
          content: `Count: **${session.questionCount}**\nPick a mode.`,
          components: makeModeSelect(sessionId),
        });
        await persistSession(gameSessionStore, session);
        return;
      }
    }

    if (action === "category" && interaction.isStringSelectMenu()) {
      const selectedValue = interaction.values[0];
      const selectedOption = interaction.component?.options?.find(
        (opt) => opt.value === selectedValue,
      );
      session.categorySlug = selectedValue;
      session.categoryName = selectedOption?.label || selectedValue;
      session.stage = "awaiting_count";
      await interaction.update({
        content: `Category selected: **${session.categoryName}**\nPick a question count.`,
        components: makeCountSelect(sessionId),
      });
      await persistSession(gameSessionStore, session);
      return;
    }

    if (action === "count" && interaction.isStringSelectMenu()) {
      session.questionCount = Number.parseInt(interaction.values[0], 10);
      session.stage = "awaiting_mode";
      await interaction.update({
        content: `Count selected: **${session.questionCount}**\nPick a mode.`,
        components: makeModeSelect(sessionId),
      });
      await persistSession(gameSessionStore, session);
      return;
    }

    if (action === "mode" && interaction.isStringSelectMenu()) {
      session.mode = interaction.values[0];
      session.stage = "awaiting_timer";
      await interaction.update({
        content: `Mode: **${session.mode}**\nPick a timer per question.`,
        components: makeTimerSelect(sessionId),
      });
      await persistSession(gameSessionStore, session);
      return;
    }

    if (action === "timer" && interaction.isStringSelectMenu()) {
      session.questionTimeLimitMs =
        Number.parseInt(interaction.values[0], 10) * 1000 || DEFAULT_TIME_LIMIT;
      session.stage = "asking";

      await interaction.update({
        content: "Fetching questions...",
        components: [],
      });

      try {
        session.questions = await fetchQuestions({
          categorySlug: session.categorySlug,
          count: session.questionCount || 5,
        });
      } catch (error) {
        console.error("Trivia fetch failed:", error);
        await interaction.editReply({
          content: "Could not fetch questions. Try again later.",
          components: [],
        });
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      if (!session.questions.length) {
        await interaction.editReply({
          content: "No questions found. Try a different category.",
          components: [],
        });
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      session.currentQuestionIndex = -1;
      session.answers = {};
      await persistSession(gameSessionStore, session);

      await interaction.editReply({
        content: "Starting trivia...",
        components: [],
      });
      await askNextQuestion(interaction.client, session, gameSessionStore, {
        initialInteraction: interaction,
      });
      return;
    }

    if (action === "answer") {
      await handleAnswer(interaction, session, gameSessionStore, parts[3]);
      return;
    }

    if (action === "open") {
      if (session.stage !== "asking" || session.currentQuestionIndex < 0) {
        return interaction.reply({
          content: "This trivia round isn't accepting answers right now.",
          ephemeral: true,
        });
      }
      if (session.activeMessageId && interaction.message?.id && interaction.message.id !== session.activeMessageId) {
        return interaction.reply({
          content: "That question already moved on.",
          ephemeral: true,
        });
      }
      const modal = new ModalBuilder()
        .setCustomId(`triv|${sessionId}|modal`)
        .setTitle("Trivia Answer");
      const input = new TextInputBuilder()
        .setCustomId("answer")
        .setLabel("Your answer")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }
  },
  async handleModal(interaction, { gameSessionStore }) {
    const parts = interaction.customId.split("|");
    if (parts[0] !== "triv") return;
    const sessionId = parts[1];
    const action = parts[2];
    if (action !== "modal") return;
    const session = sessions.get(sessionId);
    if (!session) {
      return interaction.reply({ content: "This trivia game ended.", ephemeral: true });
    }
    if (session.stage !== "asking" || session.currentQuestionIndex < 0) {
      return interaction.reply({
        content: "This trivia round isn't accepting answers right now.",
        ephemeral: true,
      });
    }
    const answer = interaction.fields.getTextInputValue("answer");
    await handleAnswer(interaction, session, gameSessionStore, answer);
  },
  async init({ gameSessionStore, client }) {
    await loadSessions(gameSessionStore, client);
  },
};
