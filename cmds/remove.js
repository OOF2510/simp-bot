module.exports = {
  name: "remove",
  aliases: ["removesong", "rm"],
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
    let SongID = parseInt(args[0]) - 1;
    let song = client.player.remove(message, SongID);
    if (song){
      let em = new Discord.MessageEmbed()
      .setTitle(`Removed`)
      .setDescription(`Removed song ${song.name} (${args[0]}) from the Queue!`)
      .setColor(config.embedColor)
      message.channel.send(em);
    }
  },
};
