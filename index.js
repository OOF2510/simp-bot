const Discord = require("discord.js");
const { existsSync } = require("fs");
const { MongoClient } = require("mongodb");
const GameSessionStore = require("./util/game_session_store");
const cron = require("node-cron");

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

// Load interactive command handlers that need button/modal routing
const akinatorCommand = require("./cmds/fun/akinator");
const geoGuessCommand = require("./cmds/fun/geoguess");
const triviaCommand = require("./cmds/fun/trivia");

// NORMAL + MESSAGE CONTENT
const intents = new Discord.IntentsBitField(3276541);
const client = new Discord.Client({ intents: intents });

client.commands = new Discord.Collection();

const cmdFiles = require("./util/getAllFiles")("./cmds/").filter((file) =>
  file.endsWith(".js"),
);

for (const file of cmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const devCmdFiles = require("./util/getAllFiles")("./devCmds/").filter((file) =>
  file.endsWith(".js"),
);

for (const file of devCmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const menuCmdFiles = require("./util/getAllFiles")("./contextMenu/").filter(
  (file) => file.endsWith(".js"),
);

for (const file of menuCmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

let mongoClient;
let db;
let collections = {};
let gameSessionStore;
let usageSummaryJob;

async function initDatabase() {
  const mongoCfg = config.mongodb || {};
  if (!mongoCfg.url || !mongoCfg.database) {
    throw new Error("MongoDB connection details missing in config");
  }

  mongoClient = new MongoClient(mongoCfg.url);
  await mongoClient.connect();
  db = mongoClient.db(mongoCfg.database);
  gameSessionStore = new GameSessionStore({ client: mongoClient, db });
  collections = {
    autopub: db.collection("autopublish"),
    dellog: db.collection("dellog"),
    warnings: db.collection("warnings"),
    marriages: db.collection("marriages"),
    proposals: db.collection("proposals"),
    commandLogs: db.collection("command_logs"),
    usageSummaries: db.collection("usage_summaries"),
  };

  await Promise.all([
    collections.autopub.createIndex({ serverId: 1 }, { unique: true }),
    collections.dellog.createIndex({ serverId: 1 }, { unique: true }),
    collections.warnings.createIndex({ serverId: 1, userId: 1 }),
    collections.marriages.createIndex({ serverId: 1, userId: 1 }),
    collections.marriages.createIndex({ serverId: 1, spouseId: 1 }),
    collections.proposals.createIndex({ serverId: 1, proposerId: 1 }),
    collections.commandLogs.createIndex({ timestamp: 1 }),
    collections.usageSummaries.createIndex({ channelId: 1 }, { unique: true }),
  ]);
  console.log("Connected to MongoDB");
}

async function logCommandUsage(commandName, guildId) {
  if (!collections.commandLogs) return;
  try {
    await collections.commandLogs.insertOne({
      command: commandName,
      guildId: guildId ? String(guildId) : null,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log command usage:", error);
  }
}

function getEasternDateInfo(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});

  const offsetPart = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");

  const offset = (offsetPart?.value || "GMT-05:00").replace("GMT", "");
  const isoBase = `${parts.year}-${parts.month}-${parts.day}`;
  const easternNow = new Date(`${isoBase}T${parts.hour}:${parts.minute}:${parts.second}${offset}`);
  const startOfDay = new Date(`${isoBase}T00:00:00${offset}`);

  return { easternNow, startOfDay, offset };
}

async function sendDailyCommandSummary() {
  const channelId = config.usageSummaryChannelId;
  if (!channelId) return;
  if (!collections.commandLogs) return;

  const { easternNow, startOfDay } = getEasternDateInfo(new Date());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const dailyMatch = {
    timestamp: { $gte: startOfDay, $lt: endOfDay },
    command: { $ne: null },
  };
  const allTimeMatch = { command: { $ne: null } };

  let channel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch (error) {
    console.error("Unable to fetch usage summary channel:", error);
    return;
  }

  try {
    const [dailySummary, totalCount, topCommands, leastCommands] =
      await Promise.all([
        collections.commandLogs
          .aggregate([
            { $match: dailyMatch },
            {
              $group: {
                _id: { command: "$command" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ])
          .toArray(),
        collections.commandLogs.countDocuments(dailyMatch),
        collections.commandLogs
          .aggregate([
            { $match: allTimeMatch },
            {
              $group: {
                _id: { command: "$command" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 3 },
          ])
          .toArray(),
        collections.commandLogs
          .aggregate([
            { $match: allTimeMatch },
            {
              $group: {
                _id: { command: "$command" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: 1 } },
            { $limit: 3 },
          ])
          .toArray(),
      ]);

    const formatList = (items) =>
      items
        .map((item) => `${item._id.command || "unknown"} - ${item.count}`)
        .join("\n") || "No data";

    const dailyList = formatList(dailySummary);
    const topList = formatList(topCommands);
    const leastList = formatList(leastCommands);

    let existingMessage;
    try {
      const summaryRecord = await collections.usageSummaries.findOne({
        channelId,
      });
      if (summaryRecord?.messageId) {
        existingMessage = await channel.messages.fetch(summaryRecord.messageId);
      }
    } catch (fetchError) {
      console.warn("Unable to fetch previous usage summary message:", fetchError);
    }

    const embed = new Discord.EmbedBuilder()
      .setColor(config.embedColor || Discord.Colors.Blurple)
      .setTitle(`${client.user?.tag || "Bot"} Command Summary`)
      .addFields(
        {
          name: "Updated at",
          value: `<t:${Math.floor(easternNow.getTime() / 1000)}:f>`,
        },
        {
          name: "Commands Ran Today",
          value:
            totalCount === 0
              ? "No commands used today yet."
              : dailyList,
          inline: true,
        },
        {
          name: "Nerd Stats",
          value: `**3 most used commands!**\n${topList}\n\n**3 least used commands!**\n${leastList}`,
          inline: true,
        },
      )
      .setFooter({ text: `Total commands today: ${totalCount}` })
      .setTimestamp(new Date());

    let message;
    try {
      if (existingMessage) {
        message = await existingMessage.edit({ embeds: [embed] });
      } else {
        message = await channel.send({ embeds: [embed] });
      }
    } catch (sendError) {
      console.error("Error sending or updating usage summary message, retrying with new message:", sendError);
      try {
        message = await channel.send({ embeds: [embed] });
      } catch (retryError) {
        console.error("Retry failed for usage summary message:", retryError);
        return;
      }
    }

    try {
      await collections.usageSummaries.updateOne(
        { channelId },
        {
          $set: {
            channelId,
            messageId: message.id,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } catch (recordError) {
      console.error("Failed to persist usage summary message reference:", recordError);
    }

    console.log("Usage summary updated");
  } catch (error) {
    console.error("Error sending daily command usage summary:", error);
  }
}

function scheduleUsageSummary() {
  if (usageSummaryJob || !config.usageSummaryChannelId) return;
  usageSummaryJob = cron.schedule(
    "0 * * * *",
    () => {
      if (!client.isReady()) return;
      sendDailyCommandSummary();
    },
    { timezone: "America/New_York" },
  );
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

  scheduleUsageSummary();
  sendDailyCommandSummary();

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
        { body: commands },
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
  if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
    const customId = interaction.customId || "";
    if (customId.startsWith("aki|")) {
      return akinatorCommand.handleComponent?.(interaction, { client, gameSessionStore, db, collections });
    }
    if (customId.startsWith("geo|")) {
      return geoGuessCommand.handleComponent?.(interaction, { client, gameSessionStore, db, collections });
    }
    if (customId.startsWith("triv|")) {
      if (interaction.isModalSubmit() && typeof triviaCommand.handleModal === "function") {
        return triviaCommand.handleModal(interaction, { client, gameSessionStore, db, collections });
      }
      return triviaCommand.handleComponent?.(interaction, { client, gameSessionStore, db, collections });
    }
  }

  if (interaction.type != Discord.InteractionType.ApplicationCommand) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;
  if (!interaction.inGuild()) return;

  interaction.author = interaction.user;
  interaction.send = interaction.reply;

  try {
    const dbContext = { db, collections, client: mongoClient, gameSessionStore };
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
            `An error occured when **${interaction.author.tag}** tried to run **${commandName}**: \`\`\`${error}\`\`\``,
          );
        });
        try {
          await interaction.reply({
            content:
              "There was an error while executing this command! Join the support server to get help! https://discord.gg/FDBBHvJBTh",
            ephemeral: true,
          });
        } catch (e) {
          try {
            await interaction.editReply({
              content:
                "There was an error while executing this command! Join the support server to get help! https://discord.gg/FDBBHvJBTh",
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
        `An error occured when **${interaction.author.tag}** tried to run **${commandName}**: \`\`\`${error}\`\`\``,
      );
    });
    await interaction.reply({
      content:
        "There was an error while executing this command! Join the support server to get help! https://discord.gg/FDBBHvJBTh",
      ephemeral: true,
    });
    try {
      await interaction.reply({
        content:
          "There was an error while executing this command! Join the support server to get help! https://discord.gg/FDBBHvJBTh",
        ephemeral: true,
      });
    } catch (e) {
      try {
        await interaction.editReply({
          content:
            "There was an error while executing this command! Join the support server to get help! https://discord.gg/FDBBHvJBTh",
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
        await logCommandUsage(commandName, interaction.guildId);
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
          `Text commands are no longer supported! Please use slash commands! If you don't see any when you type \`/\`, re-auth the bot (or ask admins to) with this link: https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&scope=bot%20applications.commands`,
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
    client.gameSessionStore = gameSessionStore;
    // Initialize long-lived game stores
    if (typeof akinatorCommand.init === "function") {
      await akinatorCommand.init({ client, gameSessionStore });
    }
    if (typeof geoGuessCommand.init === "function") {
      await geoGuessCommand.init({ client, gameSessionStore });
    }
    if (typeof triviaCommand.init === "function") {
      await triviaCommand.init({ client, gameSessionStore });
    }
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
    if (gameSessionStore) {
      await gameSessionStore.disconnect();
    }
    if (usageSummaryJob) {
      usageSummaryJob.stop();
    }
  } catch (error) {
    console.error("Error closing Mongo connection:", error);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
