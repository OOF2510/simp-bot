const Discord = require("discord.js");
const fs = require("fs");
const os = require("os");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const Keyv = require("keyv");
const { DiscordTogether } = require("discord-together");
const voice = require("@discordjs/voice");

let config;
var startupArgs = process.argv.slice(2);
if (startupArgs[0] == "--dev") config = require("./config.dev.json");
else config = require("./config.json");

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

intents = new Discord.Intents(32509);

const client = new Discord.Client({ intents: intents });

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
const wcDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "welcomeChannels",
});
const djDB = new Keyv(`mongodb://${config.mongoURI}`, {
  collection: "DJRoles",
});
console.log("Connected to DBs");

preDB.on("error", (err) => console.error("Keyv error:", err));
nbDB.on("error", (err) => console.error("Keyv error:", err));
bchDB.on("error", (err) => console.error("Keyv error:", err));
blDB.on("error", (err) => console.error("Keyv error", err));
wcDB.on("error", (err) => console.error("Keyv error", err));
djDB.on("error", (err) => console.error("Keyv error", err));

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.discordTogether = new DiscordTogether(client);
// client.voice = voice;

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

client.on("guildMemberAdd", async (member) => {
  let guild = member.guild;
  let welcomeEnabled = await wcDB.get(guild.id);
  if (!welcomeEnabled) return;
  let welcomeChannel = guild.channels.cache.get(welcomeEnabled);
  welcomeChannel.send(`${member} welcome to **${guild.name}**`);
});

client.on("guildCreate", async (guild) => {
  nbDB.set(guild.id, "true");
  let defC = getDefaultChannel(guild);
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
  if (!defC) return;
  defC.send(
    "Thanks for adding me UwU, you can see my commands by doing `s!help`"
  );
});

client.on("guildDelete", (guild) => {
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
});

client.on("messageCreate", async (msg) => {
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
        blDB,
        wcDB,
        djDB
      );
  } catch (error) {
    console.error(error);
    msg.reply(
      `An error occured executing that command! Try again! (\`${error}\`)`
    );
  }
});

client.login(config.token);
