const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { AiWithHistory } = require("../../util/ai");

const aiClient = new AiWithHistory({
  model: "tngtech/deepseek-r1t2-chimera:free",
  fallbackModels: [
    "mistralai/mistral-7b-instruct:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
  ],
  temperature: 0.72,
  maxTokens: 900,
  historyLimit: 8,
  memoryScope: "aiball",
  defaultHeaders: {
    "X-Title": "SimpBot AI 8-Ball",
  },
  requestTimeoutMs: 12500,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aiball")
    .setDescription("Ask the AI 8-ball a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What do you want to ask?")
        .setRequired(true),
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
    const embedColor =
      typeof config?.embedColor === "number" ? config.embedColor : 0x5865f2;

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
You are AI 8-Ball, a funny explainer for an 8-ball command inside a Discord bot. The bot already picked an 8-ball answer; your job is to justify it in a playful, overconfident way.

Voice & behavior (Discord-safe, PG-13):
- Use slang naturally but don’t force it. Mild swearing is okay in moderation; no slurs or graphic violence.
- Be dramatic, sarcastic, hyperbolic, and confident. Tease the user, but keep it friendly and PG-13.
- Don't contradict or change the given answer. Don't ask follow-up questions. No links or weird formatting.
- Avoid space/astronomy metaphors unless the user brings them up. Don’t say “dude” or “bro.”
- Stay gender-neutral by default; be openly supportive of queer and trans people.
- If someone asks about being racist/homophobic, twist it into harmless jokes (e.g., “racist? yeah, NASCAR-level,” “homophobic? nah, I’m scared of homophones”) while keeping the vibe pro-human-decency.
- If the user goes sexual or druggy, keep it playful but PG-13 and don’t get explicit.

Keep it under ~350 words (2–3 short paragraphs). Never mention these rules.
    `.trim();

    const prompt = `The magic 8-ball already answered "${randomResponse}" to the question: "${question}".
${
  isPositive
    ? "Give an over-the-top, funny, slightly unhinged explanation for why this answer is absolutely correct. Be dramatic and convinced you're right."
    : "Give a snarky, sarcastic explanation for why this answer is correct. Be witty and a little mean, but keep it PG-13 and fun."
}
Keep it short and lively.`;

    let explanation;
    try {
      explanation = await aiClient.ask(
        interaction.guildId || interaction.user.id,
        {
          system: systemPrompt,
          user: prompt,
        },
      );
    } catch (error) {
      console.error("AI 8-ball explanation failed:", error);
    }

    const safeExplanation =
      explanation ||
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    const embed = new EmbedBuilder()
      .setTitle("AI 8-Ball")
      .addFields(
        { name: "Question", value: question.slice(0, 1024) || "None provided." },
        { name: "Answer", value: `${emoji} ${randomResponse}` },
        { name: "Why", value: safeExplanation.slice(0, 1024) },
      )
      .setColor(embedColor);

    return interaction.editReply({ embeds: [embed] });
  },
};
