module.exports = {
  name: "ping",
  aliases: ["p"],
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
    var MongoPing0 = await exec(`ping -c 1 ${config.mongoShards[0]} | grep time=`)
    var MongoPing1 = await exec(`ping -c 1 ${config.mongoShards[1]} | grep time=`)
    var MongoPing2 = await exec(`ping -c 1 ${config.mongoShards[2]} | grep time=`)

    var mongoping0 = MongoPing0.stdout.trim()
    var mongoping1 = MongoPing1.stdout.trim()
    var mongoping2 = MongoPing2.stdout.trim()

    var mongoPing0 = Number(mongoping0.split("time=").pop().replace(" ms", ``))
    var mongoPing1 = Number(mongoping1.split("time=").pop().replace(" ms", ``))
    var mongoPing2 = Number(mongoping2.split("time=").pop().replace(" ms", ``))

    var MongoPing = mongoPing0 + mongoPing1 + mongoPing2;
    var mongoPing = Math.round(MongoPing / 3);

    const pingEm = new Discord.MessageEmbed()
      .setTitle(`Pong UwU!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
        { name: `Database Ping`, value: `\`${mongoPing}ms\``, inline: true }
      )
      .setColor("RANDOM");

    msg.reply(pingEm);
  },
};
