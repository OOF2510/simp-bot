module.exports = {
  name: "pp",
  execute(
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
    Discord
  ) {
    let response;
    let sender = msg.author;

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = author;
    let recMem = guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      "8D",
      "8=D",
      "8==D",
      "8===D",
      "8====D",
      "8=====D",
      "8======D",
      "8=======D",
      "8========D",
      "8=========D",
      "8==========D",
      "8===========D",
    ];

    if (recipient.id == "463119138500378624") {
      //me
      response = "8======================================================D";
      const ppEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.channel.send(ppEm);
    } else if (recipient.id == "793910661293801524") {
      //robbie
      response = "8=====================================================D";
      const ppEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.channel.send(ppEm);
    } else if (recipient.id == "463119267832004620") {
      //noah
      response = ".";
      const ppEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.channel.send(ppEm);
    } else if (recipient.id == "763480802511945789") {
      //gerrardo
      response = "8===================================================D";
      const ppEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.channel.send(ppEm);
    } else {
      response = responses[Math.floor(Math.random() * responses.length)];

      const ppEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.channel.send(ppEm);
    }
  },
};
