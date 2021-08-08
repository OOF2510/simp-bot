const { ping } = require("@oof2510/ping");

module.exports = {
  name: "ping",
  cat: "info",
  usage: "ping",
  desc: "Gets the ping of the bot and databases",
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
    bchDB,
    blDB
  ) {
    var mongoPing0 = await ping(config.mongoShards[0]);
    var mongoPing1 = await ping(config.mongoShards[1]);
    var mongoPing2 = await ping(config.mongoShards[2]);

    var MongoPing = mongoPing0 + mongoPing1 + mongoPing2;
    var mongoPing = Math.round(MongoPing / 3);

    var llPing;
    llPing = await ping(config.lavalinkHost).catch((error) => {
      llPing = "Error pinging!";
    });

    const pingEm = new Discord.MessageEmbed()
      .setTitle(`Pong UwU!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
        { name: `Database Ping`, value: `\`${mongoPing}ms\``, inline: true },
        {
          name: "Lavalink (music) Ping",
          value: `\`${Math.round(llPing)}ms\``,
          inline: true,
        }
      )
      .setFooter(`Powered by opulent.host`)
      .setColor(config.embedColor);

    msg.reply({ embeds: [pingEm] });
  },
};
