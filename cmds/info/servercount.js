const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servercount")
    .setDescription("Returns the amount of servers simp bot is in"),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    msg.reply(`Simp Bot is in ${client.guilds.cache.size} servers!`);
  },
};
