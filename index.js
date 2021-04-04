const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const os = require("os");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const Keyv = require("keyv");
const { ReactionCollector } = require("discord.js-collector");

var allowed = [
  "463119138500378624", //me
  "760473112613093436", //gavin
  "793910661293801524", //robbie
  "463119267832004620", //noah
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

const intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
const client = new Discord.Client({ intents: intents });

const preDB = new Keyv("sqlite://./prefixes.sqlite");
const nbDB = new Keyv("sqlite://./nobroad.sqlite");
const bchDB = new Keyv("sqlite://./broadchs.db");
const blDB = new Keyv("sqlite://./blacklist.db");
const niDB = new Keyv("sqlite://./noserverinfo.db");

preDB.on("error", (err) => console.error("Keyv error:", err));
nbDB.on("error", (err) => console.error("Keyv error:", err));
bchDB.on("error", (err) => console.error("Keyv error:", err));
blDB.on("error", (err) => console.error("Keyv error", err));
niDB.on("error", (err) => console.error("Keyv error", err));

client.commands = new Discord.Collection();

const cmdFiles = fs
  .readdirSync("./cmds")
  .filter((file) => file.endsWith(".js"));

for (const file of cmdFiles) {
  const cmd = require(`./cmds/${file}`);
  client.commands.set(cmd.name, cmd);
}

client.once("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.name}`);
  });
  console.log(client);
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
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

  if (channel.type === "dm") return;

  let prefix = await preDB.get(guild.id);
  if (!prefix) prefix = config.prefix;

  if (!msg.content.startsWith(prefix)) return;

  let blacklisted = await blDB.get(author.id);
  if (blacklisted)
    return channel.send(`You have been banned from using simp bot!`);

  const args = msg.content.slice(prefix.length).trim().split(" ");
  const cmd = args.shift().toLowerCase();

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
        niDB,
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
  let defC = getDefaultChannel(guild);
  async function sendSI() {
    let invite = await defC.createInvite({
      maxAge: 10 * 60 * 1000,
      maxUses: 1,
    });

    let delEm = new Discord.MessageEmbed()
      .setTitle("Thanks for adding me to your server!")
      .setDescription(
        "Info about your server, including invite link gets sent to my team when you add me to your server, would you like this to be deleted?"
      )
      .setFooter("You can use the `noinfo` command to have this data deleted")
      .setTimestamp();

    defC.send(delEm);
  }
  sendSI();
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
  defC.send(
    "Thanks for adding me UwU, you can see my commands by doing `s!help`"
  );
});

client.on("guildDelete", (guild) => {
  let rmCh = client.channels.cache.get("825803669688680488");
  let owner = guild.ownerID;
  async function sendSI() {
    let SIEm = new Discord.MessageEmbed()
      .setTitle(guild.name)
      .setDescription(guild.id)
      .setColor("RANDOM")
      .addFields(
        { name: `Member count`, value: guild.memberCount, inline: true },
        { name: `Owner ID`, value: owner, inline: true }
      );
    rmCh.send(SIEm);
  }
  sendSI();
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
    type: "WATCHING",
  });
});

client.login(config.token);
