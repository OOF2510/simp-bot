module.exports = {
  name: "support",
  aliases: ["supportserver"],
  cat: "info",
  usage: "support",
  desc: "Join the support server!",
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
    let supEm = new Discord.MessageEmbed()
      .setAuthor(botNick, client.user.avatarURL)
      .setTitle(`Join Simp Bot Support!`)
      .setURL("https://discord.gg/zHtfa8GdPx")
      .setTimestamp();

    channel.send({ embeds: [supEm] });
  },
};
