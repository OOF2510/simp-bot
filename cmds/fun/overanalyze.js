const { SlashCommandBuilder } = require("discord.js");
const { Ai } = require("../../util/ai");

const overanalyzer = new Ai({
  model: "google/gemma-3-27b-it:free",
  fallbackModels: [
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "qwen/qwen2.5-vl-32b-instruct:free",
  ],
  temperature: 0.65,
  maxTokens: 1000,
  defaultHeaders: {
    "X-Title": "SimpBot Overanalyze",
  },
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("overanalyze")
    .setDescription("Overanalyze an image or short video (PG-13)")
    .addAttachmentOption((option) =>
      option
        .setName("media")
        .setDescription("Image or video to overanalyze")
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
    const attachment = interaction.options.getAttachment("media", true);
    const contentType = (attachment.contentType || "").toLowerCase();

    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");

    if (!isImage && !isVideo) {
      return interaction.reply({
        content: "Please attach an image or a short video.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const attachments = isVideo
      ? [
          {
            type: "video",
            url: attachment.url,
            mimeType: attachment.contentType || undefined,
          },
        ]
      : [
          {
            type: "image",
            url: attachment.url,
            mimeType: attachment.contentType || undefined,
          },
        ];

    const sysPrompt = `
You are THE OVERTHINKER, a chaotic media analyst who overanalyzes everything with absurd confidence.
Stay PG-13 and Discord-safe: no explicit content or graphic violence.

MEDIA RULES:
- If you receive one image attachment: treat it as a single photo.
- If you receive a video attachment: describe it like a continuous clip.

TONE RULES:
- Lean into playful conspiracy-style logic, strange symbolism, and academic jargon.
- Be confident and dramatic but keep it fun and safe-for-work.

OUTPUT FORMAT:
**GRAND THEORY:**
[A dramatic paragraph explaining the real truth behind the media]

**EVIDENCE:**
[5-8 bullet points of findings you claim to see]

**COUNTER-THEORY:**
[A totally different interpretation that contradicts the first]

**FINAL CONCLUSION:**
[One short sentence that is confidently wrong]
`.trim();

    const prompt = `
Analyze this ${isVideo ? "video" : "image"} and overthink it completely.
Keep everything PG-13 and avoid real-world hate or explicit material.
    `.trim();

    let response;

    try {
      response = await overanalyzer.ask({
        system: sysPrompt,
        user: prompt,
        attachments,
      });
    } catch (err) {
      console.error("[overanalyze] AI request failed:", err);
      return interaction.editReply("Error while overanalyzing that media.");
    }

    if (!response) {
      return interaction.editReply("I couldn't come up with anything. Try again?");
    }

    // Discord supports Markdown already; trim to keep replies manageable.
    return interaction.editReply(response.slice(0, 4000));
  },
};
