const { SlashCommandBuilder } = require("discord.js");
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
    )
  ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction

    let url = interaction.options.getString("url");
    if (!isURL(url)) return msg.reply("That is not a valid URL!", { ephemeral: true });

    shortUrl.short(url, function (err, url) {
      msg.reply(`<${url}>`);
    });
  },
};
