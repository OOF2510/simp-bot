const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const { existsSync, mkdirSync } = require("fs");
const { writeFile, unlink } = require("fs/promises");
const voice = require("@discordjs/voice");
const { GroqAi } = require("../../util/ai");

const ttsClient = new GroqAi({ requestTimeoutMs: 20000 });

const VOICE_CHOICES = [
  "Arista-PlayAI",
  "Atlas-PlayAI",
  "Basil-PlayAI",
  "Briggs-PlayAI",
  "Calum-PlayAI",
  "Celeste-PlayAI",
  "Cheyenne-PlayAI",
  "Chip-PlayAI",
  "Cillian-PlayAI",
  "Deedee-PlayAI",
  "Fritz-PlayAI",
  "Gail-PlayAI",
  "Indigo-PlayAI",
  "Mamaw-PlayAI",
  "Mason-PlayAI",
  "Mikail-PlayAI",
  "Mitch-PlayAI",
  "Quinn-PlayAI",
  "Thunder-PlayAI",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Speaks given message in VC")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to say").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("voice")
        .setDescription("Pick a PlayAI voice")
        .addChoices(
          ...VOICE_CHOICES.map((name) => ({ name, value: name })),
        ),
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let message = interaction.options.getString("text");
    const selectedVoice =
      interaction.options.getString("voice") || "Fritz-PlayAI";
    let guild = interaction.guild;

    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    if (!existsSync("./temp")) {
      mkdirSync("./temp");
    }

    let timeStamp = new Date();
    let filename = "./temp/" + guild.name + `-` + timeStamp + ".wav";

    message = message.replaceAll("'", "");

    await msg.deferReply({ ephemeral: true });

    try {
      const audioBuffer = await ttsClient.tts(message, {
        voice: selectedVoice,
      });

      await writeFile(filename, audioBuffer);
      console.log(
        `[TTS] Generated audio for guild ${guild?.id || guild?.name} using ${selectedVoice}`,
      );

      const channelID = msg.member.voice.channelId;
      const Channel = client.channels.cache.get(channelID);

      const player = voice.createAudioPlayer();
      const connection = voice.joinVoiceChannel({
        channelId: channelID,
        guildId: Channel.guild.id,
        adapterCreator: Channel.guild.voiceAdapterCreator,
      });

      const resource = voice.createAudioResource(filename);
      player.play(resource);

      connection.subscribe(player);

      player.on("error", async (error) => {
        console.error("TTS playback error:", error);
        player.stop();
        await msg.editReply("Error occurred while playing audio.");
        unlink(filename).catch(() => {});
        connection.destroy();
      });

      player.on(voice.AudioPlayerStatus.Idle, async () => {
        player.stop();
        await msg.editReply("I have spoken!");
        unlink(filename).catch(() => {});
        connection.destroy();
      });
    } catch (error) {
      console.error("TTS generation failed:", error);
      await msg.editReply("Error occurred while generating audio.");
    }
  },
};