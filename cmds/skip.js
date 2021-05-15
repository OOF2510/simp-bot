module.exports = {
  name: "skip",
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
    let message = msg
    let song = client.player.skip(message);
    if (song) { 
      let em = new Discord.MessageEmbed()
      .setTitle(`Skipped`)
      .setDescription(`${song.name} was skipped!`)
      .setColor("RANDOM");
      message.channel.send(em);
    }
    },
};
