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
    bchDB,
    blDB
  ) {
    var MongoPing0;
    var MongoPing1;
    var MongoPing2;

    if (os.platform() == "win32") {
      MongoPing0 = await exec(
        `ping -n 1 ${config.mongoShards[0]} | findstr time=`
      );
      MongoPing1 = await exec(
        `ping -n 1 ${config.mongoShards[1]} | findstr time=`
      );
      MongoPing2 = await exec(
        `ping -n 1 ${config.mongoShards[2]} | findstr time=`
      );
    } else {
      MongoPing0 = await exec(
        `ping -c 1 ${config.mongoShards[0]} | grep time=`
      );
      MongoPing1 = await exec(
        `ping -c 1 ${config.mongoShards[1]} | grep time=`
      );
      MongoPing2 = await exec(
        `ping -c 1 ${config.mongoShards[2]} | grep time=`
      );
    }

    var mongoping0 = MongoPing0.stdout.trim();
    var mongoping1 = MongoPing1.stdout.trim();
    var mongoping2 = MongoPing2.stdout.trim();

    var mongoPing0;
    var mongoPing1;
    var mongoPing2;
    if (os.platform == "win32")
      mongoPing0 = Number(mongoping0.split("time=").pop().split("ms ")[0]);
    else mongoPing0 = Number(mongoping0.split("time=").pop().split(" ms")[0]);

    if (os.platform == "win32")
      mongoPing1 = Number(mongoping1.split("time=").pop().split("ms ")[0]);
    else mongoPing1 = Number(mongoping1.split("time=").pop().split(" ms")[0]);

    if (os.platform == "win32")
      mongoPing2 = Number(mongoping2.split("time=").pop().split("ms ")[0]);
    else mongoPing2 = Number(mongoping2.split("time=").pop().split(" ms")[0]);

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
