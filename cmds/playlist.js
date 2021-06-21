module.exports = {
  name: "playlist",
  aliases: ["pl", "playl"],
  cat: "music",
  usage: "playlist <playlist url>",
  desc: "Adds specified playlist to queue",
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
    await client.player.playlist(message, {
      search: args.join(" "),
      maxSongs: 20,
    });
  },
};
