module.exports = {
  name: "nowplaying",
  aliases: ["np"],
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
    let message = msg;
    let song = await client.player.nowPlaying(message);
    if (song) {
      let em = new Discord.MessageEmbed()
        .setTitle(`Now Playing`)
        .setDescription(`Current song: ${song.name}`)
        .setColor(config.embedColor);
      message.channel.send(em);
    }
  },
};
