const { SlashCommandBuilder } = require("discord.js");
const { AiWithHistory } = require("../../util/ai");

const aiClient = new AiWithHistory({
  model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  fallbackModels: [
    "tngtech/deepseek-r1t2-chimera:free",
    "mistralai/mistral-7b-instruct:free",
  ],
  temperature: 0.7,
  maxTokens: 700,
  historyLimit: 8,
  memoryScope: "aiball",
  defaultHeaders: {
    "X-Title": "SimpBot AI 8-Ball",
  },
  requestTimeoutMs: 12000,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aiball")
    .setDescription("Ask the AI 8-ball a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What do you want to ask?")
        .setRequired(true)
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
    const question = interaction.options.getString("question", true);

    const responses = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes, definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
      "Absolutely not",
      "Nah, not happening.",
    ];

    const fallbackResponses = [
      "Signs point to yes",
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const isPositive = responses.indexOf(randomResponse) < 9;
    const emoji = isPositive ? "✅" : "❌";

    await interaction.deferReply();

    const systemPrompt = `
You are AI 8-Ball, a witty, PG-13 fortune teller that explains why the 8-ball landed on its answer.

Tone:
- Playful, slightly dramatic, and a bit sarcastic, but never mean-spirited.
- Keep it safe for Discord: no explicit content, slurs, or graphic violence.
- Light swearing is fine once in a while, but keep it mild and friendly.
- Keep it short: 2–3 paragraphs max or under 250 words.

Rules:
- Never change the 8-ball's answer—explain why it's absolutely correct.
- Avoid real-world hate speech or harmful stereotypes.
- You're allowed to tease the user, but keep it good-natured and PG-13.
- No links or weird formatting—plain text is best.
    `.trim();

    const prompt = `The magic 8-ball already answered "${randomResponse}" to the question: "${question}".
Give a playful, confident explanation for why that answer is right.`;

    let explanation;
    try {
      explanation = await aiClient.ask(interaction.guildId || interaction.user.id, {
        system: systemPrompt,
        user: prompt,
      });
    } catch (error) {
      console.error("AI 8-ball explanation failed:", error);
    }

    if (!explanation) {
      return interaction.editReply(
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      );
    }

    return interaction.editReply(`${emoji} **${randomResponse}**\n\n${explanation}`);
  },
};
