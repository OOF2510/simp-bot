const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const kanye = require("kanye.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanyequote")
    .setDescription("Gives a random quote by Ye (Kanye West)"),
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

    let { quote } = await kanye();
    let quoteEm = new EmbedBuilder()
      .setTitle(`"${quote}"`)
      .setFooter({ text: `- Ye` })
      .setColor(config.embedColor);
    msg.reply({ embeds: [quoteEm] });
  },
};
