module.exports = {
  name: "stop",
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
    let isDone = client.player.stop(message);
    if (isDone) message.channel.send("Music stopped, the Queue was cleared!");
  },
};
