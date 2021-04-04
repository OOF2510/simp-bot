module.exports = {
  name: "support",
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
    let supEm = new Discord.MessageEmbed()
      .setAuthor(botNick, client.user.avatarURL)
      .setTitle(`Join Simp Bot Support!`)
      .setURL("https://discord.gg/zHtfa8GdPx")
      .setTimestamp();

    channel.send(supEm);
  },
};
