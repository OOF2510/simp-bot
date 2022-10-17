const Discord = require("discord.js");
const { existsSync } = require("fs");
const Sequelize = require("sequelize");
const { DiscordTogether } = require("discord-together");
const { ActivityType } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

let config;
var startupArgs = process.argv.slice(2);
if (startupArgs[0] == "--dev") config = require("./config.dev.json");
else config = require("./config.json");

var allowed = config.allowed;

// NORMAL
// intents = new Discord.IntentsBitField(3243773);
// const client = new Discord.Client({ intents: intents });

// NORMAL + MESSAGE CONTENT
intents = new Discord.IntentsBitField(3276541);
const client = new Discord.Client({ intents: intents });

client.commands = new Discord.Collection();
client.discordTogether = new DiscordTogether(client);
client.distube = new DisTube(client, {
  leaveOnStop: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  leaveOnFinish: true,
  plugins: [
    new SpotifyPlugin({ emitEventsAfterFetching: true }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});
client.emotes = {
  play: "▶️",
  stop: "⏹️",
  queue: "📄",
  success: "☑️",
  repeat: "🔁",
  error: "❌",
};

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

let db;

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client);
  if (existsSync("./temp/lastStatus.json")) require("./util/setStatus")(client);
  else
    client.user.setActivity(`${client.guilds.cache.size} servers!`, {
      type: ActivityType.Watching,
    });
  const auth = config.mysql; // bartholemew was here
  const options = {
    host: auth.ip,
    port: auth.port,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  };
  db = new Sequelize(auth.schema, auth.username, auth.password, options);
  console.log("Connected to DB");

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
    await command
      .execute(interaction, client, config, db, allowed)
      .catch(async (error) => {
        console.log(error);
        config.feedbackChannels.bugs.forEach((chid) => {
          let bugChannel = client.channels.cache.get(chid);
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
    console.log(error);
    config.feedbackChannels.bugs.forEach((chid) => {
      let bugChannel = client.channels.cache.get(chid);
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
        db.query(
          `INSERT INTO ${config.mysql.schema}.command_usage (command,date) values ("${commandName}",CURRENT_DATE())`
        );
      } catch (e) {
        console.log(`errror with command usage stats ${e}`);
      }
      break;
  }
});

const status = (queue) => `Volume: \`${queue.volume}%\``;
client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${
        song.formattedDuration
      }\`\n\`Requested by ${song.user.tag}\`\n${status(queue)}`
    )
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue\n\`Requested by ${song.user.tag}\``
    )
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on("error", (channel, e) => {
    if (channel)
      channel.send(
        `${client.emotes.error} | An error encountered: ${e
          .toString()
          .slice(0, 1974)}`
      );
    else console.error(e);
  })
  .on("searchNoResult", (message, query) =>
    message.channel.send(
      `${client.emotes.error} | No result found for \`${query}\`!`
    )
  )
  .on("finish", (queue) => queue.textChannel.send("Finished!"));

client.on("messageCreate", async (msg) => {
  try {
    let status = await db.query(
      `SELECT status FROM ${config.mysql.schema}.autopub WHERE status = TRUE AND serverid = ${msg.guild.id} LIMIT 1;`,
      { plain: true, type: Sequelize.QueryTypes.SELECT }
    );
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
  try {
    let sbserver = client.guilds.cache.get(config.devCmdServerID);
    let kanye = sbserver.emojis.cache.find(
      (emoji) => emoji.name.toLowerCase() === "kanye"
    );
    let msgArray = msg.content.toLowerCase().split(" ");
    if (msgArray.includes("ye"))
      return msg.react(kanye).catch((e) => {
        return;
      });
    else if (msgArray.includes("kanye"))
      return msg.react(kanye).catch((e) => {
        return;
      });
  } catch (e) {
    return;
  }
});

client.on("messageDelete", async (msg) => {
  try {
    let status = await db.query(
      `SELECT status FROM ${config.mysql.schema}.dellog WHERE status = TRUE AND serverid = ${msg.guild.id} LIMIT 1;`,
      { plain: true, type: Sequelize.QueryTypes.SELECT }
    );
    if (status.status != 1) return;
    let chid = await db.query(
      `SELECT channelid FROM ${config.mysql.schema}.dellog WHERE serverid = ${msg.guild.id} LIMIT 1;`,
      { plain: true, type: Sequelize.QueryTypes.SELECT }
    );
    let ch = msg.guild.channels.cache.get(chid.channelid);

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

client.login(config.token);
