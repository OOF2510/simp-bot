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

const sessions = new Map(); // sessionId -> session
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
  const { data } = await axios.get(QUESTION_ENDPOINT, { params });
  return (data || []).map((q) => ({
    question: decodeText(q.question),
    correctAnswer: decodeText(q.correctAnswer),
    incorrectAnswers: Array.isArray(q.incorrectAnswers)
      ? q.incorrectAnswers.map(decodeText)
      : [],
    category: decodeText(q.category),
    type: q.type,
  }));
}

const makeCategorySelect = (sessionId, categories) => {
  const options = topCategoriesFromMap(categories);
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|category`)
    .setPlaceholder("Select a category")
    .addOptions(options);
  return [new ActionRowBuilder().addComponents(menu)];
};

const makeCountSelect = (sessionId) => {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`triv|${sessionId}|count`)
    .setPlaceholder("How many questions?")
    .addOptions(
      QUESTION_COUNTS.map((c) => ({ label: `${c} question${c > 1 ? "s" : ""}`, value: String(c) })),
    );
  return [new ActionRowBuilder().addComponents(menu)];
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
  return [new ActionRowBuilder().addComponents(menu)];
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
  return [new ActionRowBuilder().addComponents(menu)];
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
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`triv|${sessionId}|skip`)
      .setLabel("Skip")
      .setStyle(ButtonStyle.Secondary),
  );
  return [row];
};

const makeOpenAnswerButtons = (sessionId) => [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`triv|${sessionId}|open`)
      .setLabel("Answer")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`triv|${sessionId}|skip`)
      .setLabel("Skip")
      .setStyle(ButtonStyle.Secondary),
  ),
];

const formatScoreboard = (scoreboard) => {
  const entries = Object.entries(scoreboard || {}).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return "No points yet.";
  return entries.map(([userId, score]) => `<@${userId}>: **${score}**`).join("\n");
};

const questionEmbed = (session, question) => {
  const embed = new EmbedBuilder()
    .setTitle(`Trivia (${session.currentQuestionIndex + 1}/${session.questions.length})`)
    .setDescription(question.question)
    .setColor(0x9b59b6);
  if (question.category) {
    embed.addFields({ name: "Category", value: question.category, inline: true });
  }
  embed.addFields({
    name: "Scoreboard",
    value: formatScoreboard(session.scoreboard),
  });
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
  sessions.delete(sessionId);
  clearTimer(sessionId);
  if (store?.enabled) {
    await store.deleteTriviaSession(sessionId);
  }
}

async function askQuestion(interaction, session, store) {
  clearTimer(session.sessionId);
  const question = session.questions[session.currentQuestionIndex];
  if (!question) {
    await finishGame(interaction, session, store);
    return;
  }

  const embed = questionEmbed(session, question);
  if (session.mode === MODES.MULTIPLE_CHOICE) {
    const answers = shuffleArray([
      question.correctAnswer,
      ...(question.incorrectAnswers || []),
    ]).slice(0, 4);
    session.currentAnswers = answers;
    const msg = await interaction.editReply({
      embeds: [embed],
      components: makeAnswerButtons(session.sessionId, answers),
    });
    session.activeMessageId = msg.id;
  } else {
    session.currentAnswers = null;
    const msg = await interaction.editReply({
      embeds: [embed],
      components: makeOpenAnswerButtons(session.sessionId),
    });
    session.activeMessageId = msg.id;
  }

  if (session.questionTimeLimitMs) {
    const timeout = setTimeout(async () => {
      try {
        await interaction.followUp({
          content: `⏲️ Time's up for question ${session.currentQuestionIndex + 1}!`,
        });
        await handleSkip(interaction, session, store, true);
      } catch (e) {
        console.error("Trivia timer error:", e);
      }
    }, session.questionTimeLimitMs);
    timers.set(session.sessionId, timeout);
  }

  await persistSession(store, session);
}

async function finishGame(interaction, session, store) {
  clearTimer(session.sessionId);
  const embed = new EmbedBuilder()
    .setTitle("Trivia Finished!")
    .setDescription("Thanks for playing.")
    .addFields({ name: "Final Scores", value: formatScoreboard(session.scoreboard) })
    .setColor(0x2ecc71);
  await interaction.editReply({ embeds: [embed], components: [] });
  await removeSession(store, session.sessionId);
}

async function handleCorrect(interaction, session, userId) {
  clearTimer(session.sessionId);
  session.scoreboard[userId] = (session.scoreboard[userId] || 0) + 1;
  session.currentQuestionIndex += 1;
  await persistSession(interaction.client.gameSessionStore, session);
  await interaction.followUp({ content: `<@${userId}> got it right! 🎉` });
  await askQuestion(interaction, session, interaction.client.gameSessionStore);
}

async function handleSkip(interaction, session, store, fromTimer = false) {
  clearTimer(session.sessionId);
  session.currentQuestionIndex += 1;
  if (!fromTimer) {
    await interaction.reply({ content: "Skipped.", ephemeral: true }).catch(() => {});
  }
  await askQuestion(interaction, session, store);
}

async function handleAnswer(interaction, session, answerText) {
  const store = interaction.client.gameSessionStore;
  const question = session.questions[session.currentQuestionIndex];
  if (!question) {
    await interaction.reply({ content: "Game already ended.", ephemeral: true });
    await removeSession(store, session.sessionId);
    return;
  }

  if (session.mode === MODES.MULTIPLE_CHOICE) {
    const idx = Number.parseInt(answerText, 10);
    const choice = session.currentAnswers?.[idx];
    if (!choice) {
      return interaction.reply({ content: "Invalid choice.", ephemeral: true });
    }
    const correct = normalizeAnswer(choice) === normalizeAnswer(question.correctAnswer);
    if (correct) {
      await interaction.update({ components: [] });
      await handleCorrect(interaction, session, interaction.user.id);
    } else {
      await interaction.reply({ content: "Nope!", ephemeral: true });
    }
    return;
  }

  // Open ended
  const cleaned = normalizeAnswer(answerText);
  const correct = cleaned === normalizeAnswer(question.correctAnswer);
  if (correct) {
    await interaction.reply({ content: "Correct! 🎉" });
    await handleCorrect(interaction, session, interaction.user.id);
  } else {
    await interaction.reply({ content: "Nope, try again!", ephemeral: true });
  }
}

async function loadSessions(store) {
  if (!store?.enabled) return;
  const saved = await store.listTriviaSessions();
  saved.forEach((doc) => {
    if (!doc.sessionId || !doc.channelId) return;
    sessions.set(doc.sessionId, {
      ...doc,
      channelId: doc.channelId,
      guildId: doc.guildId,
      userId: doc.userId,
      scoreboard: doc.scoreboard || {},
      answers: doc.answers || {},
      questions: Array.isArray(doc.questions) ? doc.questions : [],
      currentQuestionIndex:
        typeof doc.currentQuestionIndex === "number" ? doc.currentQuestionIndex : -1,
      questionTimeLimitMs: doc.questionTimeLimitMs || null,
    });
  });
  if (saved.length) {
    console.log(`Restored ${saved.length} Trivia sessions`);
  }
}

module.exports = {
  data: new SlashCommandBuilder().setName("trivia").setDescription("Play trivia together"),
  async execute(interaction, client, config, dbContext) {
    const { gameSessionStore } = dbContext;
    const sessionId = randomUUID();
    const categories = await fetchCategories().catch(() => new Map());
    const session = {
      sessionId,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      stage: "awaiting_category",
      scoreboard: {},
      questions: [],
      currentQuestionIndex: -1,
      questionTimeLimitMs: null,
    };
    sessions.set(sessionId, session);

    await interaction.reply({
      content: "Select a category to start Trivia.",
      components: makeCategorySelect(sessionId, categories),
    });

    await persistSession(gameSessionStore, session);
  },
  async handleComponent(interaction, { gameSessionStore }) {
    const parts = interaction.customId.split("|");
    if (parts[0] !== "triv") return;
    const sessionId = parts[1];
    const action = parts[2];
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

    if (["category", "count", "mode", "timer"].includes(action) && !isOwner) {
      return interaction.reply({
        content: "Only the host can configure the game.",
        ephemeral: true,
      });
    }

    if (action === "category" && interaction.isStringSelectMenu()) {
      session.categorySlug = interaction.values[0];
      session.categoryName = interaction.values[0];
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
        Number.parseInt(interaction.values[0], 10) * 1000 || null;
      session.stage = "asking";

      try {
        session.questions = await fetchQuestions({
          categorySlug: session.categorySlug,
          count: session.questionCount || 5,
        });
      } catch (error) {
        console.error("Trivia fetch failed:", error);
        await interaction.update({
          content: "Could not fetch questions. Try again later.",
          components: [],
        });
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      if (!session.questions.length) {
        await interaction.update({
          content: "No questions found. Try a different category.",
          components: [],
        });
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      session.currentQuestionIndex = 0;
      await interaction.update({ content: "Starting trivia...", components: [] });
      await askQuestion(interaction, session, gameSessionStore);
      return;
    }

    if (action === "answer") {
      await handleAnswer(interaction, session, parts[3]);
      return;
    }

    if (action === "open") {
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

    if (action === "skip") {
      await handleSkip(interaction, session, gameSessionStore);
      return;
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
    const answer = interaction.fields.getTextInputValue("answer");
    await handleAnswer(interaction, session, answer);
  },
  async init({ gameSessionStore }) {
    await loadSessions(gameSessionStore);
  },
};
