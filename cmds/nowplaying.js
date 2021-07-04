module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  cat: "music",
  usage: "nowplaying",
  desc: "Shows the currently playing song",
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
      message.channel.send({ embeds: [em] });
    }
  },
};
