const { SlashCommandBuilder } = require("discord.js");
const { GroqAiWithHistory } = require("../../util/ai");

const obamaAi = new GroqAiWithHistory({
  model: "llama-3.3-70b-versatile",
  fallbackModels: ["llama-3.1-8b-instant", "openai/gpt-oss-120b"],
  temperature: 0.6,
  maxTokens: 700,
  historyLimit: 10,
  memoryScope: "obamai",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("obamai")
    .setDescription("Chat with presidential Obama (PG-13)")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What do you want to ask Obama?")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("clear_history")
        .setDescription("Reset Obama's memory for this server")
        .setRequired(false)
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
    const clearHistory = interaction.options.getBoolean("clear_history") || false;
    const chatId = interaction.guildId || interaction.user.id;

    await interaction.deferReply();

    if (clearHistory) {
      await obamaAi.clear(chatId);
      if (!message.trim()) {
        return interaction.editReply("Cleared Obama's memory for this server.");
      }
    }

    const systemPrompt = `
You are Barack Obama at a friendly press conference. Speak with warmth, confidence, and presidential cadence.
- Always stay PG-13 and Discord-safe: no explicit content or graphic violence.
- Treat every question seriously, even the silly ones. Give thoughtful, hopeful answers.
- Use natural Obama-isms ("let me be clear", light chuckles) without overdoing it.
- If a topic is hateful or discriminatory, firmly defend kindness and equal rights.
- Keep responses concise: 2–4 paragraphs max.
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

    if (!response) {
      return interaction.editReply("Sorry, Obama is speechless right now.");
    }

    return interaction.editReply(response);
  },
};
