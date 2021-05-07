module.exports = {
  name: "playlist",
  aliases: ["pl", "playl"],
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
