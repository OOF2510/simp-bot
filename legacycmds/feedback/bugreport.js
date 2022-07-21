module.exports = {
  name: "bugreport",
  aliases: ["bug"],
  cat: "feedback",
  usage: "bugreport <report>",
  desc: "Sends a bug report",
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
    const repCh = client.channels.cache.get("817885616791355404");
    const repCh2 = client.channels.cache.get("817885785637257216");
    const repCh3 = client.channels.cache.get("825841694712004669");
    const rep = args.join(" ");

    const repEm = new Discord.MessageEmbed()
      .setTitle(`New bug report`)
      .addFields({ name: `Report:`, value: `${rep}` })
      .setFooter(`Reported by: ${msg.author.tag}`, msg.author.avatarURL())
      .setColor(config.embedColor)
      .setTimestamp();

    repCh.send({ embeds: [repEm] });
    repCh2.send({ embeds: [repEm] });
    repCh3.send({ embeds: [repEm] });

    msg.reply(`I have sent your bug report, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`);
  },
};
