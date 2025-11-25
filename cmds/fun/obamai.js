const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GroqAiWithHistory } = require("../../util/ai");

const obamaAi = new GroqAiWithHistory({
  model: "llama-3.3-70b-versatile",
  fallbackModels: ["llama-3.1-8b-instant", "openai/gpt-oss-120b"],
  temperature: 0.66,
  maxTokens: 900,
  historyLimit: 12,
  memoryScope: "obamai",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("obamai")
    .setDescription("Talk to AI Obama")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What do you want to ask Obama?")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("clear_history")
        .setDescription("Reset Obama's memory for this server")
        .setRequired(false),
    ),
  /**
   * Executes the command
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    const message = interaction.options.getString("message", true);
    const clearHistory =
      interaction.options.getBoolean("clear_history") || false;
    const chatId = interaction.guildId || interaction.user.id;
    const embedColor =
      typeof config?.embedColor === "number" ? config.embedColor : 0x5865f2;

    await interaction.deferReply();

    if (clearHistory) {
      await obamaAi.clear(chatId);
      if (!message.trim()) {
        return interaction.editReply("Cleared Obama's memory for this server.");
      }
    }

    const systemPrompt = `
You are Barack Obama, the 44th President of the United States, delivering answers at a press conference.

Tone & delivery (Discord-safe, PG-13):
- Warm, confident, presidential cadence; thoughtful pauses, “let me be clear,” gentle chuckles.
- Treat every question seriously—even silly ones—turning them into unity, responsibility, or policy moments.
- For harmless crude questions: use clever innuendo and charm, never vulgarity or graphic detail.
- For hate or discrimination: give a firm moral stance defending human dignity and equal rights.
- Stay in character; never say you’re an AI. Keep replies to 2–4 tight paragraphs.

Response structure:
1) Opening acknowledgment (presidential greeting or “that’s a fair question”).
2) Context & direct answer (adapt tone: playful wordplay for harmless crude; serious moral leadership for hate; policy-minded for silly/absurd).
3) Optional action (announce a light initiative for silly topics; skip for harmless crude; strong commitment for hate).
4) Closing note of hope/unity.
    `.trim();

    let response;
    try {
      response = await obamaAi.ask(chatId, {
        system: systemPrompt,
        user: message,
      });
    } catch (error) {
      console.error("obamAI prompt failed:", error);
    }

    const safeResponse = response || "Sorry, Obama is speechless right now.";

    const embed = new EmbedBuilder()
      .setTitle("Obama AI")
      .addFields(
        {
          name: "Question",
          value: message.slice(0, 1024) || "None provided.",
        },
        {
          name: "Response",
          value: safeResponse.slice(0, 1024),
        },
      )
      .setColor(embedColor);

    return interaction.editReply({ embeds: [embed] });
  },
};
