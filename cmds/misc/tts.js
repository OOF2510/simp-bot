const { SlashCommandBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const { existsSync, mkdirSync } = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const voice = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("speaks given message in vc")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to say").setRequired(true)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let message = interaction.options.getString("text");
    let guild = interaction.guild;
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    if (!existsSync("./temp")) {
      mkdirSync("./temp");
    }

    let timeStamp = new Date();
    let filename = "./temp/" + guild.name + `-` + timeStamp + ".mp3";

    message = message.replaceAll("'", "");

    await msg.deferReply({ ephemeral: true });

    await exec(`gtts-cli '${message}' --output "${filename}"`);

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

    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata.title}`
      );
      player.stop();
    });

    player.on(voice.AudioPlayerStatus.Idle, async () => {
      player.stop();
    });

    msg.editReply("I have spoken!");
  },
};
