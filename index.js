const Discord = require("discord.js");
const fs = require("fs");
const os = require("os");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const Sequelize = require("sequelize");
const { DiscordTogether } = require("discord-together");

let config;
var startupArgs = process.argv.slice(2);
if (startupArgs[0] == "--dev") config = require("./config.dev.json");
else config = require("./config.json");

var allowed = config.allowed;

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

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.discordTogether = new DiscordTogether(client);

const cmdFiles = require("./util/getAllFiles")("./cmds/").filter((file) =>
  file.endsWith(".js")
);

for (const file of cmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.name, cmd);
  if (cmd.aliases) {
    cmd.aliases.forEach((alias) => {
      client.aliases.set(alias, cmd.name);
    });
  } else continue;
}

let db;

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.name}`);
  });
  console.log(client);
  if (fs.existsSync("./temp/lastStatus.json"))
    require("./util/setStatus")(client);
  else
    client.user.setActivity(
      `${client.guilds.cache.size} servers! | ${config.prefix}help`,
      { type: "WATCHING" }
    );
  const auth = config.mysql;
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
  db.get = require("./util/getValueFromDB");
  console.log("Connected to DB");
  console.log(client.user.tag);
});

client.on("guildCreate", async (guild) => {
  //let defC = getDefaultChannel(guild);
  //client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
  // type: "WATCHING",
  // });
  if (!defC) return;
  defC.send(
    "Thanks for adding me UwU, you can see my commands by doing `s!help`"
  );
});

client.on("guildDelete", (guild) => {
  //  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
  //  type: "WATCHING",
  // });
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

  let prefix = await db.get(
    "prefix",
    config.mysql.schema,
    "prefixes",
    "server_id",
    guild.id
  );
  if (!prefix) prefix = config.prefix;

  if (!msg.content.startsWith(prefix)) return;

  let blacklisted = await db.get(
    "user_id",
    config.mysql.schema,
    "blacklist",
    "user_id",
    author.id
  );
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
        db
      );
  } catch (error) {
    console.error(error);
    msg.reply(
      `An error occured executing that command! Try again! (\`${error}\`)`
    );
  }
});

client.login(config.token);
