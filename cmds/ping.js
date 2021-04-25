// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// function ping(host, port, pong) {
//   var started = new Date().getTime();

//   var http = new XMLHttpRequest();

//   http.open("GET", "http://" + host + ":" + port, /*async*/ true);
//   http.onreadystatechange = function () {
//     if (http.readyState == 4) {
//       var ended = new Date().getTime();

//       var milliseconds = ended - started;

//       if (pong != null) {
//         pong(milliseconds);
//       }
//     }
//   };
//   try {
//     http.send(null);
//   } catch (exception) {
//     // this is expected
//   }
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
    // var mongoPings = [];

    // var mongoPing0;
    // ping(config.mongoShards.zero, 27017, function (p) {
    //   mongoPing0 = Number(p);
    //   mongoPings.push(mongoPing0);
    // });
    // var mongoPing1;
    // ping(config.mongoShards.one, 27017, function (p) {
    //   mongoPing0 = Number(p);
    //   mongoPings.push(mongoPing1);
    // });
    // var mongoPing2;
    // ping(config.mongoShards.two, 27017, function (p) {
    //   mongoPing2 = Number(p);
    //   mongoPings.push(mongoPing2);
    // });

    // console.log(mongoPings);
    // mongoPing0 = mongoPings[0];
    // mongoPing1 = mongoPings[1];
    // mongoPing2 = mongoPings[2];

    // var MongoPing = mongoPing0 + mongoPing1 + mongoPing2;
    // var mongoPing = MongoPing / 3;

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
