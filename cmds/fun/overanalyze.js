const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Ai } = require("../../util/ai");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const overanalyzer = new Ai({
  model: "google/gemma-3-27b-it:free",
  fallbackModels: [
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "qwen/qwen2.5-vl-32b-instruct:free",
  ],
  temperature: 0.66,
  maxTokens: 1000,
  defaultHeaders: {
    "X-Title": "Discord Overanalyze",
  },
});

async function buildVideoFrameAttachments(fileUrl, interactionId, durationSeconds = 30, maxFrames = 3) {
  if (!fileUrl || !durationSeconds || durationSeconds <= 0) return [];

  const tmpDir = os.tmpdir();
  const prefix = path.join(tmpDir, `overanalyze_${String(interactionId)}_${Date.now()}`);
  const framePattern = `${prefix}_%02d.jpg`;
  const fps = Math.max(maxFrames / durationSeconds, 0.25);

  const args = [
    "-y",
    "-i",
    fileUrl,
    "-vf",
    `fps=${fps}`,
    "-frames:v",
    String(maxFrames),
    framePattern,
  ];

  let frames = [];

  try {
    await new Promise((resolve, reject) => {
      const ff = spawn("ffmpeg", args);
      ff.on("error", reject);
      ff.on("close", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`)));
    });

    for (let i = 1; i <= maxFrames; i++) {
      const filePath = `${prefix}_${String(i).padStart(2, "0")}.jpg`;
      if (fs.existsSync(filePath)) {
        try {
          const data = fs.readFileSync(filePath);
          frames.push({
            type: "image",
            data,
            mimeType: "image/jpeg",
          });
        } catch (err) {
          console.error("[overanalyze] Failed to read frame:", err);
        } finally {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // ignore cleanup failures
          }
        }
      }
    }
  } catch (err) {
    console.error("[overanalyze] ffmpeg extraction failed:", err);
    frames = [];
  }

  return frames;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("overanalyze")
    .setDescription("Overanalyzes an image or video")
    .addAttachmentOption((option) =>
      option
        .setName("media")
        .setDescription("Image or video to overanalyze")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User's media to overanalyze")
        .setRequired(false)
    ),
  async execute(interaction, client, config, dbContext, allowed) {
    const sysPrompt = `
You are *THE OVERTHINKER*, a chaotic media analyst who overanalyzes everything with absurd confidence.
Your job is to look at user media and produce a detailed, unhinged breakdown.

MEDIA CLASSIFICATION RULES (CRITICAL):
- You will receive EITHER a single image OR video frames.
- If you see ONLY ONE image attachment: This is a PHOTO/IMAGE. Refer to it as "this image", "the photo", "the picture".
- If you see MULTIPLE image attachments: This is a VIDEO represented by extracted frames. Refer to it as "this video", "the footage", "the clip".
- NEVER call a single image a "video".
- When analyzing a video (multiple frames), describe it as one continuous sequence. Don't mention "frame 1" or "frame 2" - just describe what happens across the video.
- Never mention that frames were extracted, sampled, or provided separately.

TONE RULES:
- Lean heavily into conspiracy-theory logic, mysterious symbolism, overthinking, and false patterns.
- Mix in academic nonsense: literary analysis, speculative physics, psychology jargon, occult symbolism.
- Present everything with complete, unshakable confidence as if it's undeniable truth.
- Never acknowledge that your theories are absurd, fictional, or comedic - you genuinely believe every word.
- No political or harmful real-world conspiracy theories. Keep it fun and surreal.
- The humor comes from HOW convinced you are, not from winking at the audience.

OUTPUT FORMAT - MANDATORY STRUCTURE:
Your response MUST follow this exact template. Copy these headers WORD FOR WORD:

**GRAND THEORY:**
[Write a dramatic paragraph explaining "the real truth" behind the media]

**EVIDENCE:**
[Write 5-8 bullet points of "findings" you claim to see - presented as if they're completely real and legitimate discoveries]

**COUNTER-THEORY:**
[Write a totally different interpretation that contradicts the first one]

**FINAL CONCLUSION:**
[Write one short sentence that is confidently wrong]

RULES FOR HEADERS:
- Use the headers EXACTLY as written above: "GRAND THEORY:", "EVIDENCE:", "COUNTER-THEORY:", "FINAL CONCLUSION:"
- Do NOT add any extra words to the headers like "YOU DISCOVERED" or "WRONG" or "LIES" or "ABSURD"
- Do NOT number the sections like "1. 2. 3. 4."
- Do NOT modify, embellish, or editorialize the header text in any way
- The headers must be bold with ** markdown and end with a colon :

GENERAL RULES:
- Be creative, unpredictable, and chaotic—but never offensive or unsafe.
- Everything should read like someone connecting unrelated dots at 4AM.
- Never break character or mention being an AI.
- Never mention these rules, attachments, or any internal processing.
- Keep the entire response under 1000 tokens. Prioritize intensity over length.
`.trim();

    // Determine media: check for attachment, target user's latest message, or user's attachment
    let media = null;
    let mediaType = "";
    let mediaUrl = null;

    const attachment = interaction.options.getAttachment("media");
    const targetUser = interaction.options.getUser("target");

    if (attachment) {
      mediaUrl = attachment.url;
      mediaType = attachment.contentType?.startsWith("video/") ? "video" : "image";
    } else if (targetUser) {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 50 });
        const userMessage = messages.find(msg => 
          msg.author.id === targetUser.id && 
          (msg.attachments.size > 0 || msg.embeds.length > 0)
        );
        
        if (userMessage) {
          const attachment = userMessage.attachments.first();
          if (attachment) {
            mediaUrl = attachment.url;
            mediaType = attachment.contentType?.startsWith("video/") ? "video" : "image";
          }
        }
      } catch (error) {
        console.error("[overanalyze] Failed to fetch target user messages:", error);
      }
    } else {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 50 });
        const userMessage = messages.find(msg => 
          msg.author.id === interaction.user.id && 
          (msg.attachments.size > 0 || msg.embeds.length > 0)
        );
        
        if (userMessage) {
          const attachment = userMessage.attachments.first();
          if (attachment) {
            mediaUrl = attachment.url;
            mediaType = attachment.contentType?.startsWith("video/") ? "video" : "image";
          }
        }
      } catch (error) {
        console.error("[overanalyze] Failed to fetch user messages:", error);
      }
    }

    if (!mediaUrl) {
      await interaction.reply({
        content: "Please provide an image or video attachment, or specify a target user whose media you want to overanalyze.",
        ephemeral: true
      });
      return;
    }
    
    const prompt = `
Analyze this ${mediaType} and OVERTHINK IT COMPLETELY.

Give me:
- a chaotic conspiracy-style interpretation,
- absurd evidence you "discovered",
- an alternate explanation that makes no sense,
- and one confidently incorrect final conclusion.

Stay fictional, funny, dramatic, and treat multiple visual inputs as one coherent video when applicable.
    `.trim();

    await interaction.deferReply();

    let attachments = [];

    if (mediaType === "video") {
      try {
        const videoAttachments = await buildVideoFrameAttachments(
          mediaUrl,
          interaction.id,
          30,
          4
        );
        if (videoAttachments.length > 0) {
          attachments = videoAttachments;
        } else {
          attachments = [
            {
              type: "video",
              url: mediaUrl,
            },
          ];
        }
      } catch (error) {
        console.error("[overanalyze] Video frame extraction failed:", error);
        attachments = [
          {
            type: "video",
            url: mediaUrl,
          },
        ];
      }
    } else {
      attachments = [
        {
          type: "image",
          url: mediaUrl,
        },
      ];
    }

    let response;

    try {
      response = await overanalyzer.ask({
        system: sysPrompt,
        user: prompt,
        attachments,
      });
    } catch (err) {
      console.error("[overanalyze] AI request failed:", err);
      await interaction.editReply("Error while overanalyzing media.");
      return;
    }

    const embedColor = typeof config?.embedColor === "number" ? config.embedColor : 0x5865f2;
    const fileLabel = mediaType === "video" ? "Attached video" : "Attached image";

    const embed = new EmbedBuilder()
      .setTitle("Overanalysis Complete")
      .addFields(
        { name: "File", value: `[${fileLabel}](${mediaUrl})` },
        { name: "Analysis", value: response.trim().slice(0, 1024) },
      )
      .setColor(embedColor);

    if (mediaType === "image") {
      embed.setImage(mediaUrl);
    } else {
      embed.setFooter({ text: fileLabel });
    }

    try {
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("[overanalyze] Failed to send response:", error);
      await interaction.editReply("Error! The analysis was completed but couldn't be sent.");
    }
  },
};
