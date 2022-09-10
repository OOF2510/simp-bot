const Discord = require("discord.js");
const { existsSync } = require("fs");
const Sequelize = require("sequelize");
const { DiscordTogether } = require("discord-together");

let config;
var startupArgs = process.argv.slice(2);
if (startupArgs[0] == "--dev") config = require("./config.dev.json");
else config = require("./config.json");

var allowed = config.allowed;

intents = new Discord.IntentsBitField(3243773);
const client = new Discord.Client({ intents: intents });

client.commands = new Discord.Collection();
client.discordTogether = new DiscordTogether(client);

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

let db;

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client);
  if (existsSync("./temp/lastStatus.json"))
    require("./util/setStatus")(client);
  else
    client.user.setActivity(
      `${client.guilds.cache.size} servers! | ${config.prefix}help`,
      { type: "WATCHING" }
    );
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
  db.get = require("./util/getValueFromDB");
  console.log("Connected to DB");

  // start loadin them slash commands
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v10");
  const { token } = config;
  const commands = [];
  const devCmds = []
  const clientId = config.clientID;
  const sbservID = config.devCmdServerID
  for (const file of cmdFiles) {
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
      await rest.put(
        Routes.applicationGuildCommands(clientId, sbservID),
        { body: devCmds }
      );
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

  interaction.author = interaction.user;
  interaction.send = interaction.reply;

  try {
    await command.execute(interaction, client, config, db, Discord, allowed);
  } catch (error) {
    console.error(error);
    bugChannel = client.channels.cache.get("825841694712004669");
    bugChannel.send(
      `An error occured when **${interaction.author.tag}** tried to run **${commandName}**: \`\`\`${error}\`\`\``
    );
    await interaction.reply({
      content: "There was an error while executing this command! Join the support server to get help! https://discord.gg/zHtfa8GdPx",
      ephemeral: true,
    });
  }
});

client.login(config.token);
