const { SlashCommandBuilder, WebhookClient } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("major-melon")
    .setDescription("MAJOR MELON."),
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

    await msg.reply({
      content: "MAJOR MELON.",
      files: [
        {
          attachment: "https://media.discordapp.net/attachments/1021763955099717664/1116788316390563880/unknown-25-1.png",
          name: "MAJOR_MELON.png",
        }
      ]
    })
  },
};
