const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const axios = require("axios");
const GeoApi = require("@oof2510/geoapi");
const { ProxyAgent } = require("undici");
const { randomUUID } = require("crypto");

const GEO_API_BASE_URL = "https://geo.api.oof2510.space";
const geoapi = new GeoApi(GEO_API_BASE_URL);
const MAX_GUESSES = 3;

const sessions = new Map(); // sessionId -> session

const isFiniteNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);
const normalizeCoordinates = (lat, lon) =>
  isFiniteNumber(lat) && isFiniteNumber(lon) ? { lat, lon } : null;
const normalizeCountry = (t) =>
  (t || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const countryAliases = (country, code) => {
  const base = new Set();
  const c = (country || "").toLowerCase();
  const cc = (code || "").toLowerCase();

  if (c) base.add(c);
  if (cc) base.add(cc);

  if (c.includes("united states")) {
    base.add("usa");
    base.add("us");
    base.add("united states of america");
    base.add("america");
  }
  if (c.includes("united kingdom")) {
    base.add("uk");
    base.add("great britain");
    base.add("britain");
    base.add("england");
  }
  if (c.includes("russia")) {
    base.add("russian federation");
  }
  if (c.includes("south korea")) {
    base.add("korea");
    base.add("republic of korea");
  }
  if (c.includes("north korea")) {
    base.add("dprk");
    base.add("democratic peoples republic of korea");
  }
  if (c.includes("united arab emirates") || c === "uae") {
    base.add("united arab emirates");
    base.add("uae");
  }
  if (c.includes("czechia")) {
    base.add("czech republic");
  }
  if (c.includes("eswatini")) {
    base.add("swaziland");
  }
  if (c.includes("east timor")) {
    base.add("timor leste");
  }
  if (
    c.includes("ivory coast") ||
    c.includes("côte d'ivoire") ||
    c.includes("cote divoire")
  ) {
    base.add("cote divoire");
    base.add("cote d'ivoire");
    base.add("ivory coast");
  }

  return Array.from(base);
};

const matchGuess = (guess, country, code) => {
  if (!guess) return false;
  if (code && (guess === code || guess === code.toLowerCase())) return true;
  if (!country) return false;
  const aliases = countryAliases(country, code);
  return aliases.some((alias) => guess === alias);
};

async function fetchGeoImage() {
  try {
    const primaryPayload = await geoapi.getImage();
    if (isValidGeoPayload(primaryPayload)) {
      return primaryPayload;
    }
    console.warn("GeoFinder invalid payload from GeoApi client");
  } catch (primaryError) {
    console.warn(
      "GeoFinder GeoApi client failed, retrying with fetch",
      primaryError?.message,
    );
  }

  const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || null;
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;
  const response = await fetch(`${GEO_API_BASE_URL}/getImage`, {
    dispatcher,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Fetch fallback failed with status ${response.status}${
        text ? `: ${text.slice(0, 120)}` : ""
      }`,
    );
  }

  const fallbackPayload = await response.json();
  if (!isValidGeoPayload(fallbackPayload)) {
    throw new Error("Fetch fallback returned invalid payload");
  }

  return fallbackPayload;
}

async function downloadImageStream(url) {
  const res = await axios.get(url, {
    responseType: "stream",
    timeout: 15000,
    headers: { "User-Agent": "simp-bot/1.0 (GeoFinder command)" },
  });
  return res.data;
}

function isValidGeoPayload(payload) {
  if (!payload || typeof payload !== "object") return false;
  const { imageUrl, coordinates } = payload;
  if (!imageUrl || typeof imageUrl !== "string") return false;
  if (!coordinates || typeof coordinates !== "object") return false;
  const { lat, lon } = coordinates;
  return isFiniteNumber(lat) && isFiniteNumber(lon);
}

function buildSessionEmbed(session, showAnswer = false) {
  const incorrect = session.incorrectGuesses || [];
  const guessesText = incorrect.length
    ? incorrect.map((g) => `❌ ${g}`).join("\n")
    : "No wrong guesses yet.";
  const base = new EmbedBuilder()
    .setTitle("🌍 GeoFinder")
    .setDescription(
      showAnswer
        ? `Game ended! It was **${session.displayName || "Unknown"}** ${
            session.coord
              ? `(${session.coord.lat.toFixed(4)}, ${session.coord.lon.toFixed(4)})`
              : ""
          }`
        : `Guess the country! (Guess ${session.guessCount + 1}/${MAX_GUESSES})`,
    )
    .addFields({ name: "Guesses", value: guessesText })
    .setColor(showAnswer ? 0x2ecc71 : 0x3498db);
  if (session.imageUrl) {
    base.setImage(session.imageUrl);
  }
  return base;
}

async function persistSession(store, session) {
  if (!store?.enabled) return;
  await store.upsertGeoSession({
    sessionId: session.sessionId,
    chatId: session.channelId,
    photoMessageId: session.messageId,
    country: session.country,
    countryCode: session.countryCode,
    displayName: session.displayName,
    coord: session.coord,
    guessCount: session.guessCount,
    incorrectGuesses: session.incorrectGuesses,
  });
}

async function removeSession(store, session) {
  sessions.delete(session.sessionId);
  if (store?.enabled) {
    await store.deleteGeoSession(session.messageId);
  }
}

async function loadSessions(store, client) {
  if (!store?.enabled) return;
  const saved = await store.listGeoSessions();
  for (const s of saved) {
    if (!s.photoMessageId || !s.chatId) continue;
    const sessionId = s.sessionId || randomUUID();
    sessions.set(sessionId, {
      sessionId,
      channelId: String(s.chatId),
      guildId: null,
      messageId: s.photoMessageId,
      country: s.country,
      countryCode: s.countryCode,
      displayName: s.displayName,
      coord: s.coord,
      guessCount: s.guessCount || 0,
      incorrectGuesses: Array.isArray(s.incorrectGuesses)
        ? s.incorrectGuesses
        : [],
    });
  }
  if (saved.length) {
    console.log(`Restored ${saved.length} GeoFinder sessions`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("geofinder")
    .setDescription("Sends a random place image; guess the country!"),
  async execute(interaction, client, config, dbContext) {
    const { gameSessionStore } = dbContext;
    await interaction.deferReply();

    let payload;
    try {
      payload = await fetchGeoImage();
    } catch (error) {
      console.error("GeoFinder fetch failed", error);
      return interaction.editReply(
        "❌ Could not fetch a random image right now. Please try again.",
      );
    }

    const { imageUrl, countryName, countryCode, coordinates } = payload;
    const { lat, lon } = coordinates || {};
    const normalizedCoord = normalizeCoordinates(lat, lon);
    const sessionId = randomUUID();

    const embed = new EmbedBuilder()
      .setTitle("🌍 GeoFinder")
      .setDescription(
        `Guess the country! (Guess 1/${MAX_GUESSES})\nUse the button to submit.`,
      )
      .setImage(imageUrl)
      .setColor(0x3498db);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`geo|${sessionId}|guess`)
        .setLabel("Submit Guess")
        .setStyle(ButtonStyle.Primary),
    );

    const sent = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const session = {
      sessionId,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      messageId: sent.id,
      imageUrl,
      country: countryName ? countryName.toLowerCase() : null,
      countryCode,
      displayName: countryName || "Unknown",
      coord: normalizedCoord,
      guessCount: 0,
      incorrectGuesses: [],
    };
    sessions.set(sessionId, session);
    await persistSession(gameSessionStore, session);
  },
  async handleComponent(interaction, { gameSessionStore }) {
    const parts = interaction.customId.split("|");
    if (parts[0] !== "geo") return;
    const sessionId = parts[1];
    const action = parts[2];
    const session = sessions.get(sessionId);
    if (!session) {
      return interaction.reply({
        content: "This game has ended.",
        ephemeral: true,
      });
    }
    if (session.channelId !== interaction.channelId) {
      return interaction.reply({
        content: "This button isn't for this channel.",
        ephemeral: true,
      });
    }

    if (action === "guess") {
      const modal = new ModalBuilder()
        .setCustomId(`geo|${sessionId}|modal`)
        .setTitle("GeoFinder - Your Guess");
      const input = new TextInputBuilder()
        .setCustomId("guess")
        .setLabel("Country name or code")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (action === "modal") {
      const guessRaw = interaction.fields.getTextInputValue("guess");
      const guess = normalizeCountry(guessRaw);
      const isCorrect = matchGuess(guess, session.country, session.countryCode);
      session.guessCount = (session.guessCount || 0) + 1;

      if (isCorrect) {
        session.incorrectGuesses = session.incorrectGuesses || [];
        const embed = buildSessionEmbed(session, true);
        await interaction.update({ embeds: [embed], components: [] });
        await removeSession(gameSessionStore, session);
        return;
      }

      session.incorrectGuesses = [
        ...(session.incorrectGuesses || []),
        guessRaw,
      ];

      if (session.guessCount >= MAX_GUESSES) {
        const embed = buildSessionEmbed(session, true);
        await interaction.update({ embeds: [embed], components: [] });
        await removeSession(gameSessionStore, session);
        return;
      }

      const embed = buildSessionEmbed(session, false);
      await interaction.update({
        embeds: [embed],
        components: interaction.message.components,
      });
      await persistSession(gameSessionStore, session);
      return;
    }
  },
  async init({ gameSessionStore, client }) {
    await loadSessions(gameSessionStore, client);
  },
};
