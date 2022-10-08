const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
let path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gibberish")
    .setDescription("Generate gibberish"),
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

    let Gibberish = await exec(
        `python3 ${path.join(
          __dirname,
          "/../../",
          "util",
          "/",
          "gibberish.py"
        )}`
      ),
      gibberish = Gibberish.stdout.trim();

    msg.reply(`${gibberish}`);
  },
};
