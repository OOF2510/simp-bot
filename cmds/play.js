module.exports = {
  name: "play",
  aliases: ["p", "playmusic"],
  cat: "music",
  usage: "play <song name or url>",
  desc: "Plays specified song",
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
    if (client.player.isPlaying(message)) {
      let song = await client.player.addToQueue(message, args.join(" "));
    } else {
      let song = await client.player.play(message, args.join(" "));
    }
  },
};
