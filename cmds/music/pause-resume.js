const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause-resume")
    .setDescription("pauses or resumes current song"),
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

    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    if (queue.paused) {
      queue.resume();
      return msg.reply("Resumed the song for you :)");
    }
    queue.pause();
    msg.reply("Paused the song for you :)");
  },
};
