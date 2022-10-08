const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
var shortUrl = require("node-url-shortener");
const isURL = require("../../util/isURL");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shorten-url")
    .setDescription("Make a shortlink for a URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("URL (link) to shorten")
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

    let url = interaction.options.getString("url");
    if (!isURL(url))
      return msg.reply("That is not a valid URL!", { ephemeral: true });

    shortUrl.short(url, function (err, url) {
      msg.reply(`<${url}>`);
    });
  },
};
