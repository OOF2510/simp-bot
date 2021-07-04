module.exports = {
  name: "frick",
  aliases: ["fr"],
  cat: "fun",
  usage: "frick [user mention]",
  desc: "I think we all know what that does...",
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
    let sendMem = guild.members.cache.get(sender);

    let sendNick = sendMem ? sendMem.displayName : sender.username;

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = guild.members.cache.random().user;
    let recMem = guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      `${recipient} gets fricked by ${sendNick}... *How lewd...*`,
      `${sendNick} gives ${recipient} a "hug"... hmm...`,
      `Senpai... No! Not there... OwO!`,
      `oh no... daddy... no daddy...`,
      `${recipient} recieves adult fun time from ${sendNick}. Ew. `,
      `Wanna lube up this hole, ${recipient}?`,
      `${recipient} and ${sendNick} found a room to... play Xbox in...`,
      `https://gifs.le6barbare.me/img/Conversation-Gifs/thats-lewd.gif`,
      `https://i.stack.imgur.com/2PeMcm.png`,
      `Hey ${recipient} I think ${sendNick} needs to talk to you in *private* 😉`,
      `Helvete, gå knulla själv, deen jävla fitta`,
      `${sendNick} pegs ${recipient}`,
      `${sendNick} and ${recipient} do some not very christian things together`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];

    msg.channel.send(response);
  },
};
