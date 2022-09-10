const { SlashCommandBuilder } = require("discord.js");
const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("[DEV] sets the bot's status")
    .addStringOption((option) =>
      option
        .setName("status-type")
        .setDescription("type of status")
        .addChoices(
          { name: 'Playing', value: 'PLAYING' },
          { name: 'Streaming', value: 'STREAMING' },
          { name: 'Listening to', value: 'LISTENING' },
          { name: 'Watching', value: 'WATCHING' },
          { name: 'Competing in', value: 'COMPETING' },
          { name: 'Reset staus', value: 'reset' }

        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("content")
        .setRequired(true)
    )
  ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction
    if (!allowed.includes(msg.author.id)) return msg.reply(`Only the developer & certian whitelisted users can use that command!`, { ephemeral: true });
    let type = interaction.options.getString("status-type");
    let content = interaction.options.getString("content");

    if (!existsSync("./temp")) {
      mkdirSync("./temp");
    }

    if (type === "reset") {
      await client.user.setActivity(
        `${client.guilds.cache.size} servers! | ${config.prefix}help`,
        {
          type: "WATCHING",
        }
      );
      // delete last status file if exists
      if (existsSync("./temp/lastStatus.json")) {
        unlinkSync("./temp/lastStatus.json");
      }

      return msg.reply("done");
    }

    await client.user.setActivity(`${content}`, { type: type });
    msg.reply("done", { ephemeral: true });

    // save to file
    let status = {
      type: type,
      name: content,
    };

    let data = JSON.stringify(status);

    if (existsSync("./temp/lastStatus.json")) {
      unlinkSync("./temp/lastStatus.json");
    }

    writeFileSync("./temp/lastStatus.json", data);

  },
};