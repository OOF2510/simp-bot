module.exports = {
  name: "cmd_name",
  aliases: ["a1", "a2"],
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