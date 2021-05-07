module.exports = {
  name: "shuffle",
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
    let songs = client.player.shuffle(message);
    if (songs) message.channel.send("Server Queue was shuffled.");
  },
};
