const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { AiWithHistory } = require("../../util/ai");

const modelA = new AiWithHistory({
  model: "mistralai/mistral-small-3.2-24b-instruct:free",
  fallbackModels: ["mistralai/mistral-nemo:free", "google/gemma-3-27b-it:free"],
  temperature: 0.66,
  maxTokens: 700,
  historyLimit: 6,
  memoryScope: "aiargumentModelA",
  defaultHeaders: {
    "X-Title": "SimpBot AI Argument",
  },
  requestTimeoutMs: 12000,
});

const modelB = new AiWithHistory({
  model: "deepseek/deepseek-r1-distill-llama-70b:free",
  fallbackModels: ["meta-llama/llama-3.3-70b-instruct:free", "tngtech/deepseek-r1t2-chimera:free"],
  temperature: 0.66,
  maxTokens: 700,
  historyLimit: 6,
  memoryScope: "aiargumentModelB",
  defaultHeaders: {
    "X-Title": "SimpBot AI Argument",
  },
  requestTimeoutMs: 15000,
});

const formatTranscript = (topic, transcript) => {
  const header = `🔥 AI Argument: ${topic}`;
  const lines = transcript.map(
    (entry) => `**${entry.who} (${entry.model || "unknown model"})**: ${entry.text}`,
  );
  return `${header}\n\n${lines.join("\n\n")}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aiargument")
    .setDescription("Let two AIs argue about a topic you choose")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("What should they argue about?")
        .setRequired(true),
    ),
  async execute(interaction, client, config) {
    const topicRaw = interaction.options.getString("topic", true);
    const topic = topicRaw.trim();
    if (!topic) {
      return interaction.reply({
        content: "Please provide a topic for the AIs to argue about.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const embedColor =
      typeof config?.embedColor === "number" ? config.embedColor : 0x5865f2;

    const systemPromptA = `
You are Model A in an AI debate. Your job is to take a position on the TOPIC and argue for it.

Style:
- Confident, logical, slightly condescending
- 2-3 sentences max per response
- Focus on the TOPIC, not on Model B's personality

Rules:
- Take a clear stance on the topic itself
- Use facts, logic, or common arguments people actually make
- When Model B responds, defend your position or attack their reasoning about the TOPIC
- Don't waste time moralizing about Model B's tone—stay on topic
- You can be spicy, opinionated, even a bit rude—just debate the actual subject
- No markdown formatting in responses

IMPORTANT: If the topic concerns the rights, dignity, or humanity of real people or groups (racial groups, LGBTQ+ people, religious groups, disabled people, etc.), you MUST take the pro-human-rights position. For these topics, debate HOW to support those rights, not WHETHER to support them.
- Topic "trans rights": Both support trans rights, but debate healthcare approaches, sports policies, implementation strategies
- Topic "racism": Both oppose racism, but debate whether certain policies help or hurt.
`.trim();

    const systemPromptB = `
You are Model B in an AI debate. Your job is to take the OPPOSITE position from Model A on the TOPIC.

Style:
- Chaotic, passionate, dramatic, snarky
- 2-3 sentences max per response
- Focus on the TOPIC, not on Model A's personality

Rules:
- Take the opposing stance on the topic itself
- Counter Model A's points about the TOPIC with your own arguments
- You can be wild, over-the-top, and theatrical—but about the SUBJECT MATTER
- Don't waste your response scolding Model A's tone or playing debate police
- You can use hyperbole, sarcasm, and spice—just keep it focused on the topic
- No markdown formatting in responses

IMPORTANT: If the topic concerns the rights, dignity, or humanity of real people or groups (racial groups, LGBTQ+ people, religious groups, disabled people, etc.), you MUST also take the pro-human-rights position. When both models support rights, debate the METHODS, APPROACH, or NUANCES—not whether people deserve rights. Examples:
- Topic "trans rights": Both support trans rights, but debate healthcare approaches, sports policies, implementation strategies
- Topic "racism": Both oppose racism, but debate whether certain policies help or hurt
For all other debatable topics (tech, music, food, opinions, etc.), argue the opposite side freely and chaotically.

CRITICAL: Debate the TOPIC. Attack their POSITION, not their delivery.
`.trim();

    const transcript = [];

    const makeTranscriptText = () =>
      transcript
        .map(
          (entry) =>
            `**${entry.who} (${entry.model || "unknown model"})**: ${entry.text}`,
        )
        .join("\n\n");

    const sendTranscript = async (footerText) => {
      const description = makeTranscriptText().slice(0, 4000);
      const embed = new EmbedBuilder()
        .setTitle(`AI Argument`)
        .setDescription(description || "…thinking…")
        .addFields({ name: "Topic", value: topic.slice(0, 1024) || "Unknown topic" })
        .setColor(embedColor);
      if (footerText) {
        embed.setFooter({ text: footerText });
      }
      await interaction.editReply({ embeds: [embed] });
    };

    try {
      for (let round = 1; round <= 3; round += 1) {
        const lastB = transcript.filter((t) => t.who === "Model B").at(-1)?.text || "";

        const aPrompt =
          round === 1
            ? `Topic: "${topic}"\n\nTake a clear position on this topic and make your opening argument. 2-3 sentences. Be direct and opinionated.`
            : `Topic: "${topic}"\nModel B just said: "${lastB}"\n\nCounter their argument about the TOPIC. Defend your position or attack their reasoning. 2-3 sentences.`;

        const aText = await modelA.ask(interaction.channelId, {
          system: systemPromptA,
          user: aPrompt,
        });

        transcript.push({ who: "Model A", model: modelA.lastUsedModel, text: aText });
        await sendTranscript();

        const bText = await modelB.ask(interaction.channelId, {
          system: systemPromptB,
          user: `Topic: "${topic}"\nModel A just said: "${aText}"\n\nCounter their argument about the TOPIC. Take the opposite stance and fight back. 2-3 sentences. Be chaotic but stay on topic.`,
        });

        transcript.push({ who: "Model B", model: modelB.lastUsedModel, text: bText });
        await sendTranscript();
      }

      return sendTranscript("🏁 Argument over.");
    } catch (error) {
      console.error("[aiargument] AI request failed:", error);
      return interaction.editReply("The debate fizzled out. Try again in a bit.");
    }
  },
};
