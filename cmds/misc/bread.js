const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bread")
    .setDescription("gives bread to user"),
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
    msg.reply(`Here is your bread: :bread:`); // wow what a sellout cant even afford bread
  },
};
