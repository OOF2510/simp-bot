module.exports = {
  name: "invite",
  aliases: ["inv"],
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
    let invEm = new Discord.MessageEmbed()
      .setTitle(`Invite me to your server!`)
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot"
      )
      .setColor("RANDOM")
      .setTimestamp();
    channel.send(invEm);
  },
};
