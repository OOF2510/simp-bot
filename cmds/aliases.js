module.exports = {
  name: "aliases",
  aliases: ["a", "ali", "alis"],
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
    preDB,
    nbDB,
    niDB,
    bchDB,
    blDB
  ) {
    if (!args[0]) return msg.reply(`Usage: ${prefix}aliases <command>`);
    let cmd = client.commands.get(args[0]);

    if (!cmd) msg.reply('Invalid command name!')

    var Aliases = cmd.aliases;
    if (!Aliases) aliases = "No aliases!";
    let aliases = Aliases.join(", ");

    let alisEm = new Discord.MessageEmbed()
      .setTitle(`Aliases for ${cmd.name}`)
      .setDescription(aliases)
      .setColor("RANDOM")
      .setTimestamp();

    channel.send(alisEm);
  },
};
