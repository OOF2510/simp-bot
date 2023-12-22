const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const voice = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Speaks given message in vc")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to say").setRequired(true)
    ),
  async execute(interaction, client, config, db, allowed) {
    const msg = interaction;
    const message = interaction.options.getString("text");
    const guild = interaction.guild;

    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    await msg.deferReply({ ephemeral: true });

    const channelID = msg.member.voice.channelId;
    const Channel = client.channels.cache.get(channelID);

    const connection = voice.joinVoiceChannel({
      channelId: channelID,
      guildId: Channel.guild.id,
      adapterCreator: Channel.guild.voiceAdapterCreator,
    });

    const player = voice.createAudioPlayer();

    const resource = voice.createAudioResource(
      `https://translate.google.com/translate_tts?tl=en&q=${encodeURIComponent(
        message
      )}`,
      {
        inlineVolume: true,
      }
    );
    player.play(resource);

    connection.subscribe(player);

    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata.title}`
      );
      player.stop();
    });

    // player.on(voice.AudioPlayerStatus.Idle, async () => {
    //   player.stop();
    //   connection.destroy();
    // });

    msg.editReply("I have spoken!");
  },
};
