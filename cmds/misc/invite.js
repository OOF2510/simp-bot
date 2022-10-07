const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Sends the bot's invite link"),
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
    let invEm = new EmbedBuilder()
      .setTitle(`Invite me to your server!`)
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&scope=bot%20applications.commands`
      )
      .setColor(config.embedColor)
      .setTimestamp();
    msg.reply({ embeds: [invEm] });
  },
};
