const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { AkinatorWebClient } = require("../../util/akinator_client");
const { randomUUID } = require("crypto");

const SESSION_STATUS_QUESTION = "awaiting_answer";
const SESSION_STATUS_CONFIRMATION = "awaiting_confirmation";

const activeSessions = new Map(); // sessionId -> session
const sessionsByChannel = new Map(); // channelId -> sessionId

const answerEmojis = ["✅", "❌", "❓", "👍", "👎"];

const makeAnswerButtons = (sessionId, answers = []) => {
  const rows = [];

  const answerRow = new ActionRowBuilder();
  answers.slice(0, 5).forEach((label, idx) => {
    answerRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`aki|${sessionId}|answer|${idx}`)
        .setLabel(`${answerEmojis[idx] || "➡️"} ${label}`)
        .setStyle(ButtonStyle.Primary),
    );
  });
  if (answerRow.components.length) {
    rows.push(answerRow);
  }

  rows.push(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`aki|${sessionId}|stop`)
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger),
    ),
  );

  return rows;
};

const makeConfirmButtons = (sessionId) => [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`aki|${sessionId}|confirm|yes`)
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`aki|${sessionId}|confirm|no`)
      .setLabel("No")
      .setStyle(ButtonStyle.Danger),
  ),
];

const extractState = (client) => ({
  session: client.session,
  signature: client.signature,
  question: client.question,
  answers: Array.isArray(client.answers) ? client.answers.slice(0, 5) : [],
  progress: client.progress,
  currentStep: client.currentStep,
  lastPropositionId: client.lastPropositionId,
  guessCount: client.guessCount,
  baseUrl: client.baseUrl,
});

const hydrateClient = (session) => {
  const client = new AkinatorWebClient({
    region: session.region || "en",
    childMode: session.childMode === true,
  });
  const state = session.akinatorState || {};
  client.session = state.session;
  client.signature = state.signature;
  client.question = state.question || "";
  client.answers = Array.isArray(state.answers) ? state.answers.slice() : [];
  client.progress = typeof state.progress === "number" ? state.progress : 0;
  client.currentStep =
    typeof state.currentStep === "number" ? state.currentStep : 0;
  client.lastPropositionId = state.lastPropositionId || "";
  client.guessCount =
    typeof state.guessCount === "number" ? state.guessCount : 0;
  if (state.baseUrl) {
    client.baseUrl = state.baseUrl;
  }
  return client;
};

const formatQuestionEmbed = (state, user) => {
  const embed = new EmbedBuilder()
    .setTitle("Akinator")
    .setDescription(state.question || "Loading question...")
    .setColor(0x5865f2)
    .setFooter({ text: `Asked by ${user.tag}` });

  const progressText = Number.isFinite(state.progress)
    ? `${Math.round(state.progress)}%`
    : "N/A";
  embed.addFields({ name: "Confidence", value: progressText, inline: true });
  return embed;
};

const formatGuessEmbed = (guess, state, user) => {
  const description = guess.description ? ` (${guess.description})` : "";
  const rawConfidence = Number.isFinite(guess.confidence)
    ? guess.confidence
    : Number.isFinite(state?.progress)
      ? state.progress
      : null;
  const confidenceText =
    rawConfidence === null
      ? "Unknown"
      : `${Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)}%`;

  const embed = new EmbedBuilder()
    .setTitle("Akinator's Guess")
    .setDescription(`I think it's **${guess.name}**${description}.`)
    .addFields({ name: "Confidence", value: confidenceText, inline: true })
    .setColor(0xf1c40f)
    .setFooter({ text: `Asked by ${user.tag}` });
  if (guess.image) {
    embed.setThumbnail(guess.image);
  }
  return embed;
};

async function persistSession(store, session) {
  if (!store?.enabled) return;
  await store.upsertAkinatorSession(session);
}

async function removeSession(store, sessionId) {
  activeSessions.delete(sessionId);
  for (const [channelId, sid] of sessionsByChannel.entries()) {
    if (sid === sessionId) sessionsByChannel.delete(channelId);
  }
  if (store?.enabled) {
    await store.deleteAkinatorSession(sessionId);
  }
}

async function loadSessions(store) {
  if (!store?.enabled) return;
  const sessions = await store.listAkinatorSessions();
  sessions.forEach((doc) => {
    if (!doc.sessionId || !doc.channelId) return;
    activeSessions.set(doc.sessionId, doc);
    sessionsByChannel.set(doc.channelId, doc.sessionId);
  });
  if (sessions.length) {
    console.log(`Restored ${sessions.length} Akinator sessions`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("Play Akinator with buttons")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Region code (default en)")
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("child_mode")
        .setDescription("Use child-friendly mode")
        .setRequired(false),
    ),
  async execute(interaction, client, config, dbContext) {
    const { gameSessionStore } = dbContext;
    const existingSessionId = sessionsByChannel.get(interaction.channelId);
    if (existingSessionId) {
      const session = activeSessions.get(existingSessionId);
      if (session && session.status === SESSION_STATUS_CONFIRMATION) {
        return interaction.reply({
          content:
            "Still waiting on your confirmation for the last guess. Finish that first.",
          ephemeral: true,
        });
      }
      return interaction.reply({
        content:
          "Akinator is already running in this channel. Finish that round first.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const region = (interaction.options.getString("region") || "en")
      .trim()
      .toLowerCase();
    const childMode = interaction.options.getBoolean("child_mode") || false;
    const akinator = new AkinatorWebClient({ region, childMode });

    let state;
    try {
      state = await akinator.start();
    } catch (error) {
      console.error("Akinator failed to start:", error);
      return interaction.editReply("Akinator couldn't start. Try again later.");
    }

    const sessionId = randomUUID();
    const session = {
      sessionId,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      region,
      childMode,
      status: SESSION_STATUS_QUESTION,
      question: null,
      confirmation: null,
      akinatorState: extractState(akinator),
      guess: null,
    };

    const message = await interaction.editReply({
      embeds: [formatQuestionEmbed(state, interaction.user)],
      components: makeAnswerButtons(sessionId, state.answers),
    });

    session.question = {
      messageId: message.id,
      text: state.question,
      answers: state.answers,
    };

    activeSessions.set(sessionId, session);
    sessionsByChannel.set(interaction.channelId, sessionId);
    await persistSession(gameSessionStore, session);
  },
  async handleComponent(interaction, { gameSessionStore }) {
    const parts = interaction.customId.split("|");
    if (parts[0] !== "aki") return;
    const sessionId = parts[1];
    const action = parts[2];
    const arg = parts[3];
    const session = activeSessions.get(sessionId);
    if (!session) {
      return interaction.reply({
        content: "That round already ended.",
        ephemeral: true,
      });
    }
    if (session.channelId !== interaction.channelId) {
      return interaction.reply({
        content: "This button isn't for this channel.",
        ephemeral: true,
      });
    }

    const onlyOwner = session.userId === interaction.user.id;

    if (action === "stop") {
      if (!onlyOwner) {
        return interaction.reply({
          content: "Only the player who started this round can stop it.",
          ephemeral: true,
        });
      }
      await interaction.update({
        components: [],
      });
      await interaction.followUp(
        "Game stopped. Start a new one with /akinator.",
      );
      await removeSession(gameSessionStore, sessionId);
      return;
    }

    if (action === "confirm") {
      if (!onlyOwner) {
        return interaction.reply({
          content: "Only the player who started this round can confirm.",
          ephemeral: true,
        });
      }
      if (
        session.status !== SESSION_STATUS_CONFIRMATION ||
        !session.confirmation
      ) {
        return interaction.reply({
          content: "This round isn't waiting for confirmation.",
          ephemeral: true,
        });
      }

      await interaction.update({ components: [] });
      if (arg === "yes") {
        await interaction.followUp("🎉 Let's go! Told you I'm psychic.");
      } else {
        await interaction.followUp("Welp, can't win them all. You stumped me.");
      }
      await removeSession(gameSessionStore, sessionId);
      return;
    }

    if (action === "answer") {
      const answerIndex = Number.parseInt(arg, 10);
      if (
        !Number.isInteger(answerIndex) ||
        answerIndex < 0 ||
        answerIndex > 4
      ) {
        return interaction.reply({
          content: "Invalid answer.",
          ephemeral: true,
        });
      }

      const akinator = hydrateClient(session);
      let stepResult;
      try {
        stepResult = await akinator.answer(answerIndex);
      } catch (error) {
        console.error("Akinator step failed:", error);
        await interaction.reply({
          content: "Akinator hit an error. Starting over might help.",
          ephemeral: true,
        });
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      session.akinatorState = extractState(akinator);
      session.confirmation = null;
      session.guess = null;

      if (stepResult?.guess) {
        session.status = SESSION_STATUS_CONFIRMATION;
        const embed = formatGuessEmbed(
          stepResult.guess,
          session.akinatorState,
          interaction.user,
        );
        await interaction.update({
          embeds: [embed],
          components: makeConfirmButtons(sessionId),
        });
        session.confirmation = {
          messageId: interaction.message.id,
          baseMessage: embed.description,
          isPhoto: Boolean(stepResult.guess.image),
        };
        await persistSession(gameSessionStore, session);
        return;
      }

      if (!stepResult?.state?.question) {
        await interaction.update({
          components: [],
        });
        await interaction.followUp("Akinator spaced out. Try again later.");
        await removeSession(gameSessionStore, sessionId);
        return;
      }

      session.status = SESSION_STATUS_QUESTION;
      session.question = {
        messageId: interaction.message.id,
        text: stepResult.state.question,
        answers: stepResult.state.answers,
      };

      await interaction.update({
        embeds: [formatQuestionEmbed(stepResult.state, interaction.user)],
        components: makeAnswerButtons(sessionId, stepResult.state.answers),
      });
      await persistSession(gameSessionStore, session);
      return;
    }
  },
  async init({ gameSessionStore }) {
    await loadSessions(gameSessionStore);
  },
};
