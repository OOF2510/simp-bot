// const ajax = require('ajax')
// function ping(url) {
//  var encodedURL = encodeURIComponent(url);
//  var startDate = new Date();
//  var endDate = null;
//  ajax({
//    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodedURL + "%22&format=json",                                  type: "get",
//    async: false,
//    dataType: "json",                                     success: function(data) {
//      if (data.query.results != null) {                         endDate = new Date();
//      } else {
//          endDate = null;
//      }                                                   },
//    error: function(){
//      endDate = null;                                     }
//  });
//
//  if (endDate == null) {
//      throw "Not responsive...";
//  }
//
// return endDate.getTime() - startDate.getTime();
// }

module.exports = {
  name: "ping",
  aliases: ["p"],
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
    // var mongoPing0 = ping(config.mongoShards.zero)
    // var mongoPing1 = ping(config.mongoShards.one)
    // var mongoPing2 = ping(config.mongoShards.two)

    // var MongoPing = mongoPing0 + mongoPing1 + mongoPing2
    // var mongoPing = mongoPing / 3

    const pingEm = new Discord.MessageEmbed()
      .setTitle(`Pong UwU!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
        // { name: `Database Ping`, value: `\`${mongoPing}ms\``, inline: true }
      )
      .setColor("RANDOM");

    msg.reply(pingEm);
  },
};
