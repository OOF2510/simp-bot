module.exports = {
  name: "queue",
  aliases: ["q"],
  cat: "music",
  usage: "queue",
  desc: "Shows the queue",
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
    let queue = client.player.getQueue(message);
    if (queue) {
      let em = new Discord.MessageEmbed()
        .setTitle(`Queue`)
        .setDescription(
            queue.songs
              .map((song, i) => {
                return `${i === 0 ? "Now Playing" : `#${i + 1}`} - ${
                  song.name
                } | ${song.author}`;
              })
              .join("\n")
        )
        .setColor(config.embedColor);
      message.channel.send(em);
    }
  },
};
