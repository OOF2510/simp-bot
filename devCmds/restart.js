const { SlashCommandBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const { existsSync } = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("[DEV] Restarts the bot"),
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
    if (!allowed.includes(msg.author.id))
      return msg.reply(
        `Only the developer & certian whitelisted users can use that command!`,
        { ephemeral: true }
      );

    await msg.reply("restarting!", { ephemeral: true });
    process.exit(1);
  },
};
