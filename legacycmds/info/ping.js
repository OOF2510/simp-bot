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
    db
  ) {
    // var dbPing = await ping(config.mysql.ip);

    const pingEm = new Discord.MessageEmbed()
      .setTitle(`Pong UwU!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true }//,
        // {
        //   name: `Database Ping`,
        //   value: `\`${Math.round(dbPing)}ms\``,
        //   inline: true,
        // }
      )
      .setColor(config.embedColor);

    msg.reply({ embeds: [pingEm] });
  },
};
