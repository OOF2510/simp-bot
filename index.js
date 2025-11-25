const Discord = require("discord.js");
const { existsSync } = require("fs");
const { MongoClient } = require("mongodb");

let config;
var startupArgs = process.argv.slice(2);
if (startupArgs[0] == "--dev") config = require("./config.dev.json");
else config = require("./config.json");
var { allowed } = config;

function normalizeColor(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("#")) {
      const parsed = Number.parseInt(trimmed.slice(1), 16);
      return Number.isNaN(parsed) ? null : parsed;
    }
    if (trimmed.toLowerCase().startsWith("0x")) {
      const parsed = Number.parseInt(trimmed, 16);
      return Number.isNaN(parsed) ? null : parsed;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

const normalizedEmbedColor = normalizeColor(config.embedColor);
if (normalizedEmbedColor !== null) {
  config.embedColor = normalizedEmbedColor;
}

// NORMAL + MESSAGE CONTENT
const intents = new Discord.IntentsBitField(3276541);
const client = new Discord.Client({ intents: intents });

client.commands = new Discord.Collection();

const cmdFiles = require("./util/getAllFiles")("./cmds/").filter((file) =>
  file.endsWith(".js")
);

for (const file of cmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const devCmdFiles = require("./util/getAllFiles")("./devCmds/").filter((file) =>
  file.endsWith(".js")
);

for (const file of devCmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const menuCmdFiles = require("./util/getAllFiles")("./contextMenu/").filter(
  (file) => file.endsWith(".js")
);

for (const file of menuCmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

let mongoClient;
let db;
let collections = {};

async function initDatabase() {
  const mongoCfg = config.mongodb || {};
  if (!mongoCfg.url || !mongoCfg.database) {
    throw new Error("MongoDB connection details missing in config");
  }

  mongoClient = new MongoClient(mongoCfg.url);
  await mongoClient.connect();
  db = mongoClient.db(mongoCfg.database);
  collections = {
    autopub: db.collection("autopublish"),
    dellog: db.collection("dellog"),
    warnings: db.collection("warnings"),
    marriages: db.collection("marriages"),
    proposals: db.collection("proposals"),
    commandLogs: db.collection("command_logs"),
  };

  await Promise.all([
    collections.autopub.createIndex({ serverId: 1 }, { unique: true }),
    collections.dellog.createIndex({ serverId: 1 }, { unique: true }),
    collections.warnings.createIndex({ serverId: 1, userId: 1 }),
    collections.marriages.createIndex({ serverId: 1, userId: 1 }),
    collections.marriages.createIndex({ serverId: 1, spouseId: 1 }),
    collections.proposals.createIndex({ serverId: 1, proposerId: 1 }),
    collections.commandLogs.createIndex({ timestamp: 1 }),
  ]);
  console.log("Connected to MongoDB");
}

async function logCommandUsage(commandName, guildId, userId) {
  if (!collections.commandLogs) return;
  try {
    await collections.commandLogs.insertOne({
      command: commandName,
      guildId: guildId ? String(guildId) : null,
      userId: userId ? String(userId) : null,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log command usage:", error);
  }
}

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client);
  if (existsSync("./temp/lastStatus.json")) require("./util/setStatus")(client);
  else
    client.user.setActivity(`${client.guilds.cache.size} servers!`, {
      type: Discord.ActivityType.Watching,
    });

  // start loadin them slash commands
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v10");
  const { token } = config;
  const commands = [];
  const devCmds = [];
  const clientId = config.clientID;
  const sbservID = config.devCmdServerID;
  for (const file of cmdFiles) {
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
  }
  for (const file of menuCmdFiles) {
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
  }
  for (const file of devCmdFiles) {
    const command = require(`${file}`);
    devCmds.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(token);
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      await rest.put(
        Routes.applicationGuildCommands(clientId, "786722539250516007"),
        { body: commands }
      );
      await rest.put(Routes.applicationGuildCommands(clientId, sbservID), {
        body: devCmds,
      });
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();

  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.data.name}`);
  });

  console.log(client.user.tag);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type != Discord.InteractionType.ApplicationCommand) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;
  if (!interaction.inGuild()) return;

  interaction.author = interaction.user;
  interaction.send = interaction.reply;

  try {
    const dbContext = { db, collections, client: mongoClient };
    await command
      .execute(interaction, client, config, dbContext, allowed)
      .catch(async (error) => {
        if (error === "DiscordAPIError[10062]: Unknown interaction") return;
        console.log(error);
        const bugChannels = Array.isArray(config.feedbackChannels?.bugs)
          ? config.feedbackChannels.bugs
          : [];
        bugChannels.forEach((chid) => {
          let bugChannel = client.channels.cache.get(chid);
          if (!bugChannel) return;
          bugChannel.send(
            `An error occured when **${interaction.author.tag}** tried to run **${commandName}**: \`\`\`${error}\`\`\``
          );
        });
        try {
          await interaction.reply({
            content:
              "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
            ephemeral: true,
          });
        } catch (e) {
          try {
            await interaction.editReply({
              content:
                "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
              ephemeral: true,
            });
          } catch (e) {
            return;
          }
        }
      });
  } catch (error) {
    if (error === "DiscordAPIError[10062]: Unknown interaction") return;
    console.log(error);
    const bugChannels = Array.isArray(config.feedbackChannels?.bugs)
      ? config.feedbackChannels.bugs
      : [];
    bugChannels.forEach((chid) => {
      let bugChannel = client.channels.cache.get(chid);
      if (!bugChannel) return;
      bugChannel.send(
        `An error occured when **${interaction.author.tag}** tried to run **${commandName}**: \`\`\`${error}\`\`\``
      );
    });
    await interaction.reply({
      content:
        "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
      ephemeral: true,
    });
    try {
      await interaction.reply({
        content:
          "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
        ephemeral: true,
      });
    } catch (e) {
      try {
        await interaction.editReply({
          content:
            "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
          ephemeral: true,
        });
      } catch (e) {
        return;
      }
    }
  }

  // command usage stats | dont run in dev mode
  var startupArgs = process.argv.slice(2);
  switch (startupArgs[0]) {
    case "--dev":
      break;

    default:
      try {
        await logCommandUsage(commandName, interaction.guildId, interaction.user?.id);
      } catch (e) {
        console.log(`errror with command usage stats ${e}`);
      }
      break;
  }
});
  
client.on("messageCreate", async (msg) => {
  try {
    if (!msg.guild) return;
    if (!collections.autopub) return;
    const status = await collections.autopub.findOne({
      serverId: String(msg.guild.id),
      status: true,
    });
    if (!status) return;
    if (msg.channel.type == Discord.ChannelType.GuildAnnouncement) {
      if (msg.crosspostable) return msg.crosspost();
      else return;
    } else return;
  } catch (e) {
    return;
  }
});

client.on("messageCreate", async (msg) => {
  let cmdsArray = Array.from(client.commands.keys());
  cmdsArray.forEach(async (cmdName) => {
    if (msg.content.toLowerCase().startsWith(`s!${cmdName}`)) {
      try {
        return msg.reply(
          `Text commands are no longer supported! Please use slash commands! If you don't see any when you type \`/\`, re-auth the bot (or ask admins to) with this link: https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&scope=bot%20applications.commands`
        );
      } catch (e) {
        return;
      }
    }
  });
});

client.on("messageDelete", async (msg) => {
  try {
    if (!msg.guild) return;
    if (!collections.dellog) return;
    const status = await collections.dellog.findOne({
      serverId: String(msg.guild.id),
      status: true,
    });
    if (!status) return;
    const ch = msg.guild.channels.cache.get(status.channelId);
    if (!ch) return;

    let em = new Discord.EmbedBuilder()
      .setTitle(`Deleted message by ${msg.author.tag}:`)
      .setDescription(`${msg.content ? msg.content : "ERROR!"}`)
      .setColor(Discord.Colors.Red);
    ch.send({ embeds: [em] }).catch((e) => {
      return;
    });
  } catch (e) {
    return;
  }
});

async function start() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
  await client.login(config.token);
}

start();

async function shutdown() {
  try {
    if (mongoClient) {
      await mongoClient.close();
    }
  } catch (error) {
    console.error("Error closing Mongo connection:", error);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
