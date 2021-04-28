module.exports = {
  name: "frick",
  aliases: ["fr"],
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
    Discord
  ) {
    let response;
    let sender = msg.author;
    let sendMem = guild.members.cache.get(sender)

    let sendNick = sendMem ? sendMem.displayName : sender.username;

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = guild.members.cache.random().user;
    let recMem = guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      `${recNick} gets fricked by ${sendNick}... *How lewd...*`,
      `${sendNick} gives ${recNick} a "hug"... hmm...`,
      `Senpai... No! Not there... OwO!`,
      `oh no... daddy... no daddy...`,
      `${recNick} recieves adult fun time from ${sendNick}. Ew. `,
      `Wanna lube up this hole, ${recNick}?`,
      `${recNick} and ${sendNick} found a room to... play Xbox in...`,
      `https://gifs.le6barbare.me/img/Conversation-Gifs/thats-lewd.gif`,
      `https://i.stack.imgur.com/2PeMcm.png`,
      `Hey ${recNick} I think ${sendNick} needs to talk to you in *private* 😉`,
      `Helvete, gå knulla själv, deen jävla fitta`,
      `${sendNick} pegs ${recNick}`,
      `${sendNick} and ${recNick} do some not very christian things together`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];

    const frEm = new Discord.MessageEmbed()
    .setTitle(response)
    .setColor("RANDOM")
    .setFooter(recNick, recipient.avatarURL({ dynamic: true }))
    .setTimestamp();

    msg.channel.send(frEm);
  },
};
