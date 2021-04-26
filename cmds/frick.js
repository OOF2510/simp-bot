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

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = guild.members.cache.random().user;

    let responses = [
      `${recipient} gets fricked by ${sender}... *How lewd...*`,
      `${sender} gives ${recipient} a "hug"... hmm...`,
      `Senpai... No! Not there... OwO!`,
      `oh no... daddy... no daddy...`,
      `${recipient} recieves adult fun time from ${sender}. Ew. `,
      `Wanna lube up this hole, ${recipient}?`,
      `${recipient} and ${sender} found a room to... play Xbox in...`,
      `https://gifs.le6barbare.me/img/Conversation-Gifs/thats-lewd.gif`,
      `https://i.stack.imgur.com/2PeMcm.png`,
      `Hey ${recipient} I think ${sender} needs to talk to you in *private* 😉`,
      `Helvete, gå knulla själv, deen jävla fitta`,
      `${sender} pegs ${recipient}`,
      `${sender} and ${recipient} do some not very christian things together`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];

    msg.channel.send(response);
  },
};
