module.exports = {
  name: "help",
  aliases: ["h"],
  cat: "info",
  usage: "help <module>",
  desc: "Sends help embed",
  async execute(
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
    Discord
  ) {
    if (!args[0]) {
      const hIEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setColor(config.embedColor)
        .setTitle("Help")
        .setDescription(`Use ${prefix}help <module> for more info`)
        .addFields({
          name: `List of modules`,
          value: `
            \`Fun\`
            \`Settings\`
            \`Info\`
            \`Moderation\`
            \`Feedback\`
            \`Misc\`
            \`Music\``,
        })
        .setTimestamp();

      channel.send({ embeds: [hIEm] });
    }

    async function createAndSendEmbed(name, category = name) {
      let em = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle(`Help - ${name}`)
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == category) {
          setEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send({ embeds: [em] });
    }

    let cat = args[0].toLowerCase();

    switch (cat) {
      case "settings":
        createAndSendEmbed("settings");
        break;

      case "info":
        createAndSendEmbed("info");
        break;

      case "feedback":
        createAndSendEmbed("feedback");
        break;

      case "fun":
        createAndSendEmbed("fun");
        break;

      case "misc":
        createAndSendEmbed("misc");
        break;

      case "dev":
        createAndSendEmbed("dev");
        break;

      case "moderation":
        createAndSendEmbed("moderation");
        break;

      case "music":
        break;

      default:
        msg.reply("That is not a valid command module");
        break;
    }
  },
};
