const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servercount")
    .setDescription("Returns the amount of servers simp bot is in"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    msg.reply(`Simp Bot is in ${client.guilds.cache.size} servers!`);
  },
};
