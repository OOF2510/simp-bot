const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("sets music volume")
    .addIntegerOption((option) =>
      option
        .setName("percentage")
        .setDescription("volume percentage (without '%')")
        .setMinValue(parseInt(0))
        .setMaxValue(parseInt(500))
        .setRequired(true)
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
    let vol = parseInt(interaction.options.getInteger("percentage"));
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    if (isNaN(vol))
      return msg.reply(`${client.emotes.error} | Please enter a valid number!`);
    queue.setVolume(vol);
    msg.reply(`${client.emotes.success} | Volume set to \`${vol}%\``);
  },
};
