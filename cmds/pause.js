module.exports = {
  name: "pause",
  aliases: ["pau"],
  cat: "music",
  usage: "pause",
  desc: "Pauses the current song",
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
    let song = client.player.pause(message);
    if (song) message.channel.send(`${song.name} was paused!`);
  },
};
