module.exports = {
  name: "suggest",
  execute(
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
    const sugCh = client.channels.cache.get("816823026384633887");
    const sugCh2 = client.channels.cache.get("816828453110022166");
    const sugCh3 = client.channels.cache.get("825840766769299527");
    const sug = args.join(" ")

    const sugEm = new Discord.MessageEmbed()
      .setTitle(`New suggestion`)
      .addFields({ name: `Suggestion:`, value: `${sug}` })
      .setFooter(`Suggested by: ${msg.author.tag}`, msg.author.avatarURL())
      .setColor("RANDOM")
      .setTimestamp();

    sugCh.send(sugEm);
    sugCh2.send(sugEm);
    sugCh3.send(sugEm);

    msg.reply(`I have sent your suggestion, queen!`);
  },
};
