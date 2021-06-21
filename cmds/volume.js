module.exports = {
  name: "volume",
  aliases: ["vol", "setvol", "setvolume"],
  cat: "music",
  usage: "volume <volume level>",
  desc: "Sets music volume to the specified level",
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
