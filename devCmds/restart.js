const { SlashCommandBuilder } = require("discord.js");
const { existsSync } = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("[DEV] Restarts the bot"),
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
