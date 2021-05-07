module.exports = {
  name: "volume",
  aliases: ["vol", "setvol", "setvolume"],
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
    let isDone = client.player.setVolume(message, parseInt(args[0]));
    if (isDone) message.channel.send(`Volume set to ${args[0]}%!`);
  },
};
