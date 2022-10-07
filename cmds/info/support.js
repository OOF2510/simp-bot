const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Join the support server!"),
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

    let supEm = new EmbedBuilder()
      .setTitle(`Join Simp Bot Support!`)
      .setURL("https://discord.gg/zHtfa8GdPx")
      .setTimestamp();

    msg.reply({ embeds: [supEm] });
  },
};
