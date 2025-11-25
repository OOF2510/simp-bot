const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { GroqAi } = require("../../util/ai");

const stt = new GroqAi({
  model: "whisper-large-v3-turbo",
  fallbackModels: ["whisper-large-v3"],
  temperature: 0,
  maxTokens: 2048,
  defaultHeaders: {
    "X-Title": "SimpBot Transcribe",
  },
});

const ALLOWED_EXT = [
  "flac",
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "ogg",
  "wav",
  "webm",
];

const MAX_SIZE_BYTES = 19.5 * 1024 * 1024; // Groq Whisper limit

const getExtension = (attachment) => {
  const fromName = path.extname(attachment.name || "").replace(".", "").toLowerCase();
  if (fromName) return fromName;
  const contentType = (attachment.contentType || "").toLowerCase();
  if (contentType.includes("audio/")) {
    return contentType.split("/")[1];
  }
  if (contentType.includes("video/")) {
    return contentType.split("/")[1];
  }
  return "";
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transcribe")
    .setDescription("Transcribe an audio/voice/video file using Whisper")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("Audio or video file to transcribe (max 19.5MB)")
        .setRequired(true),
    ),
  async execute(interaction) {
    const attachment = interaction.options.getAttachment("file", true);
    const ext = getExtension(attachment);

    if (!ALLOWED_EXT.includes(ext)) {
      return interaction.reply({
        content: `Unsupported file type. Supported: ${ALLOWED_EXT.join(", ")}`,
        ephemeral: true,
      });
    }

    if (attachment.size && attachment.size > MAX_SIZE_BYTES) {
      return interaction.reply({
        content: "That file is too big for transcription (max 19.5MB).",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const tmpPath = path.join(
      "/tmp",
      `discord_${interaction.id}_${Date.now()}.${ext || "tmp"}`,
    );

    try {
      const response = await axios.get(attachment.url, {
        responseType: "arraybuffer",
        timeout: 20000,
      });
      fs.writeFileSync(tmpPath, response.data);

      const text = await stt.transcribe({
        file: fs.createReadStream(tmpPath),
      });

      if (!text || !text.trim()) {
        return interaction.editReply("Groq returned an empty transcription.");
      }

      return interaction.editReply(`🗣️ **Transcription:**\n\n${text.trim()}`.slice(0, 4000));
    } catch (error) {
      console.error("Transcribe error:", error);
      return interaction.editReply("Failed to transcribe that file.");
    } finally {
      fs.unlink(tmpPath, () => {});
    }
  },
};
