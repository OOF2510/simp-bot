module.exports = {
  name: "aliases",
  aliases: ["a", "ali", "alis"],
  cat: "info",
  usage: "aliases <command>",
  desc: "Lists the aliases for the specified command",
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
    Discord,
    db
  ) {
    if (!args[0]) return msg.reply(`Usage: ${prefix}aliases <command>`);
    let cmd = client.commands.get(args[0]);
    if (!cmd && client.aliases.has(args[0]))
      cmd = client.commands.get(client.aliases.get(args[0]));

    if (!cmd) return msg.reply("Invalid command name!");

    let aliases;
    var Aliases = cmd.aliases;
    if (!Aliases) aliases = "No aliases!";
    else aliases = Aliases.join(", ");

    let alisEm = new Discord.MessageEmbed()
      .setTitle(`Aliases for ${cmd.name}`)
      .setDescription(aliases)
      .setColor(config.embedColor)
      .setTimestamp();

    channel.send({ embeds: [alisEm] });
  },
};
