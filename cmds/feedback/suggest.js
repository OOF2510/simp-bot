module.exports = {
  name: "suggest",
  aliases: ["sug"],
  cat: "feedback",
  usage: "suggest <suggestion>",
  desc: "Sends a suggestion",
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
    if (!args[0]) return msg.reply(`Usage: \`${prefix}${this.usage}\``);
    const sugCh = client.channels.cache.get("816823026384633887");
    const sugCh2 = client.channels.cache.get("816828453110022166");
    const sugCh3 = client.channels.cache.get("825840766769299527");
    const sug = args.join(" ");

    const sugEm = new Discord.MessageEmbed()
      .setTitle(`New suggestion`)
      .addFields({ name: `Suggestion:`, value: `${sug}` })
      .setFooter(`Suggested by: ${msg.author.tag}`, msg.author.avatarURL())
      .setColor(config.embedColor)
      .setTimestamp();

    sugCh.send({ embeds: [sugEm] });
    sugCh2.send({ embeds: [sugEm] });
    sugCh3.send({ embeds: [sugEm] });

    msg.reply(`I have sent your suggestion, queen!`);
  },
};
