const { SlashCommandBuilder, ActivityType } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
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
          { name: "Playing", value: "PLAYING" },
          { name: "Streaming", value: "STREAMING" },
          { name: "Listening to", value: "LISTENING" },
          { name: "Watching", value: "WATCHING" },
          { name: "Competing in", value: "COMPETING" },
          { name: "Reset staus", value: "reset" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("content").setDescription("content").setRequired(true)
    ),
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
    let Type = interaction.options.getString("status-type");
    let content = interaction.options.getString("content");

    if (!existsSync("./temp")) {
      mkdirSync("./temp");
    }

    if (Type === "reset") {
      await client.user.setActivity(`${client.guilds.cache.size} servers!`, {
        type: ActivityType.Watching,
      });
      // delete last status file if exists
      if (existsSync("./temp/lastStatus.json")) {
        unlinkSync("./temp/lastStatus.json");
      }

      return msg.reply("done");
    }

    var type;
    switch (Type) {
      case "PLAYING":
        type = ActivityType.Playing;
        break;
      case "STREAMING":
        type = ActivityType.Streaming;
        break;
      case "LISTENING":
        type = ActivityType.Listening;
        break;
      case "WATCHING":
        type = ActivityType.Watching;
        break;
      case "COMPETING":
        type = ActivityType.Competing;
        break;

      default:
        break;
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
