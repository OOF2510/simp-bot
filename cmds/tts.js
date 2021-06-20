module.exports = {
  name: "tts",
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
    if (!args[0]) return msg.reply("Please provide a message to say!");

    let message = args.join(" ");

    const broadcast = client.voice.createBroadcast();
    const channelId = msg.member.voice.channelID;
    const Channel = client.channels.cache.get(channelId);
    Channel.join().then((connection) => {
      broadcast.play(client.tts.getVoiceStream(message));
      const dispatcher = connection.play(broadcast);
    });
  },
};
