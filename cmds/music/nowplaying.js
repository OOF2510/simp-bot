const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("now-playing")
    .setDescription("gets the currently playing song"),
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

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    const song = queue.songs[0];
    msg.reply(`${client.emotes.play} | I'm playing **\`${song.name}\`**`);
  },
};
