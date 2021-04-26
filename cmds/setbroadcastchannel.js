module.exports = {
  name: "setbroadcastchannel",
  aliases: [
    "brch",
    "broadch",
    "broadcastchannel",
    "setbrch",
    "sbrch",
    "sbc",
    "sbrc",
    "brchan",
    "setbr",
    "setbroadchan",
    "bch",
    "sbch",
    "setbrchan",
    "broadchan",
    "broadchannel",
    "setbroadchan",
  ],
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
    niDB,
    bchDB,
    blDB
  ) {
    if (!msg.member.permissions.has("MANAGE_MESSAGES"))
      return msg.channel.send(`You don't have permissions to do that!`);
    if (!msg.mentions.channels)
      return msg.channel.send(
        `Please mention a channel for broadcasts to go to!`
      );
    let ch = msg.mentions.channels.first();
    if (!ch.permissionsFor(botMem).has("SEND_MESSAGES"))
      msg.channel.send(
        `I don't have permissions to send messages in that channel!`
      );
    let chID = ch.id;

    await bchDB.set(guild.id, chID);

    let brChEm = new Discord.MessageEmbed()
      .setTitle("Success!")
      .setDescription(`New broadcast channel is ${ch}`)
      .setTimestamp()
      .setColor("RANDOM");

    channel.send(brChEm);
  },
};
