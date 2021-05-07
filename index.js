const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const os = require("os");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const Keyv = require("keyv");
const express = require("express");
const path = require("path");
const { Player } = require("discord-music-player");

var allowed = [
  "463119138500378624", //me
  "760473112613093436", //gavin
  "793910661293801524", //robbie
  "463119267832004620", //noah
  "686680792348622856", //ryan
];

var Long = require("long");

const getDefaultChannel = (guild) => {
  const generalChannel = guild.channels.cache.find(
    (channel) => channel.name === "general"
  );
  if (generalChannel) return generalChannel;

  if (guild.channels.cache.has(guild.id))
    return guild.channels.cache.get(guild.id);

  return guild.channels.cache
    .filter(
      (c) =>
        c.type === "text" &&
        c.permissionsFor(guild.client.user).has("SEND_MESSAGES")
    )
    .sort(
      (a, b) =>
        a.position - b.position ||
        Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()
    )
    .first();
};

async function ping(domain) {
  var PING;

  if (os.platform() == "win32")
    PING = await exec(`ping -n 1 ${domain} | findstr time=`);
  else PING = await exec(`ping -c 1 ${domain} | grep time=`);

  var Ping = PING.stdout.trim();

  var ping;

  if (os.platform == "win32")
    ping = Number(Ping.split("time=").pop().split("ms ")[0]);
  else ping = Number(Ping.split("time=").pop().split(" ms")[0]);

  return ping;
}

const intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
const client = new Discord.Client({ intents: intents });

const player = new Player(client);

const app = express();

const preDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "prefixes",
});
const nbDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "nobroadcast",
});
const bchDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "broadchs",
});
const blDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "blacklist",
});
console.log("Connected to DBs");

preDB.on("error", (err) => console.error("Keyv error:", err));
nbDB.on("error", (err) => console.error("Keyv error:", err));
bchDB.on("error", (err) => console.error("Keyv error:", err));
blDB.on("error", (err) => console.error("Keyv error", err));

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.player = player;

const cmdFiles = fs
  .readdirSync("./cmds")
  .filter((file) => file.endsWith(".js"));

for (const file of cmdFiles) {
  const cmd = require(`./cmds/${file}`);
  client.commands.set(cmd.name, cmd);
  if (cmd.aliases) {
    cmd.aliases.forEach((alias) => {
      client.aliases.set(alias, cmd.name);
    });
  } else continue;
}

client.player
  .on("channelEmpty", (message, queue) =>
    message.channel.send(
      `The **${queue.connection.channel}** was empty, music was removed!`
    )
  )
  .on("songAdd", (message, queue, song) =>
    message.channel.send(`**${song.name}** has been added to the queue!`)
  )
  .on("playlistAdd", (message, queue, playlist) =>
    message.channel.send(
      `${playlist.name} playlist with ${playlist.videoCount} songs has been added to the queue!`
    )
  )
  .on("queueEnd", (message, queue) =>
    message.channel.send(`The queue ended, nothing more to play!`)
  )
  .on("songChanged", (message, newSong, oldSong) =>
    message.channel.send(`**${newSong.name}** is now playing!`)
  )
  .on("songFirst", (message, song) =>
    message.channel.send(`**${song.name}** is now playing!`)
  )
  .on("clientDisconnect", (message, queue) =>
    message.channel.send(
      `I got disconnected from the channel, music was removed.`
    )
  )
  .on("clientUndeafen", (message, queue) =>
    message.channel.send(
      `I got disconnected from the channel, music was removed.`
    )
  )
  .on("error", (error, message) => {
    switch (error) {
      case "SearchIsNull":
        message.channel.send(`No song with that query was found.`);
        break;
      case "InvalidPlaylist":
        message.channel.send(`No Playlist was found with that link.`);
        break;
      case "InvalidSpotify":
        message.channel.send(`No Spotify Song was found with that link.`);
        break;
      case "QueueIsNull":
        message.channel.send(`There is no music playing right now.`);
        break;
      case "VoiceChannelTypeInvalid":
        message.channel.send(
          `You need to be in a Voice Channel to play music.`
        );
        break;
      case "LiveUnsupported":
        message.channel.send(`We do not support YouTube Livestreams.`);
        break;
      case "VideoUnavailable":
        message.channel.send(
          `Something went wrong while playing the current song, skipping...`
        );
        break;
      case "NotANumber":
        message.channel.send(`The provided argument was Not A Number.`);
        break;
      case "MessageTypeInvalid":
        message.channel.send(`The Message object was not provided.`);
        break;
      default:
        message.channel.send(`**Unknown Error Ocurred:** ${error}`);
        break;
    }
  });

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.name}`);
  });
  console.log(client);
  client.user.setActivity(
    `${client.guilds.cache.size} servers! | ${config.prefix}help`,
    {
      type: "WATCHING",
    }
  );
  console.log(client.user.tag);
});

client.on("message", async (msg) => {
  let channel = msg.channel;
  let author = msg.author;
  let server = msg.guild;
  let guild = server;
  let botMem = server.members.cache.get(client.user.id);
  let botNick = botMem ? botMem.displayName : client.user.username;
  let testServer = client.guilds.cache.get("786722539250516007");
  let defChannel = getDefaultChannel(server);
  let me = client.users.cache.get("463119138500378624");

  if (author.bot) return;

  if (channel.type == "dm") return;

  let prefix = await preDB.get(guild.id);
  if (!prefix) prefix = config.prefix;

  if (!msg.content.startsWith(prefix)) return;

  let blacklisted = await blDB.get(author.id);
  if (blacklisted)
    return msg.reply(`You have been banned from using simp bot!`);

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (client.aliases.has(cmd)) cmd = client.aliases.get(cmd);
  if (!client.commands.has(cmd)) return;
  try {
    client.commands
      .get(cmd)
      .execute(
        msg,
        args,
        client,
        channel,
        author,
        server,
        guild,
        botMem,
        botNick,
        testServer,
        defChannel,
        me,
        allowed,
        prefix,
        config,
        exec,
        os,
        Discord,
        preDB,
        nbDB,
        bchDB,
        blDB
      );
  } catch (error) {
    console.error(error);
    msg.reply(
      `An error occured executing that command! Try again! (\`${error}\`)`
    );
  }
});

client.on("guildCreate", async (guild) => {
  nbDB.set(guild.id, "true");
  let defC = getDefaultChannel(guild);
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
  defC.send(
    "Thanks for adding me UwU, you can see my commands by doing `s!help`"
  );
});

client.on("guildDelete", (guild) => {
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
});

client.login(config.token);
require("./dash/server");
