const { SlashCommandBuilder } = require("discord.js");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
let path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gibberish")
    .setDescription("Generate gibberish"),
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
