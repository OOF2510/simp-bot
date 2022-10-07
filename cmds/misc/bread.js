const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bread")
    .setDescription("gives bread to user"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    msg.reply(`Here is your bread: :bread:`); // wow what a sellout cant even afford bread
  },
};
