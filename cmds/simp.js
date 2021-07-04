module.exports = {
  name: "simp",
  aliases: ["s"],
  cat: "fun",
  usage: "simp [user mention]",
  desc: "Sends a random simp image/message/gif",
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
    let response;
    let sender = msg.author;
    let sendMem = guild.members.cache.get(sender);

    let sendNick = sendMem ? sendMem.displayName : sender.username;

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = guild.members.cache.random().user;
    let recMem = guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      `${recipient} damn you thicc`,
      `I paid 15 dollars for you to read my name on Twitch! `,
      `Hey ${recipient}! where my hug at???`,
      `${recipient} frick me! Please! I need attention!`,
      `Dang ${recipient} I donated to your Patreon, but still no OnlyFans! Big sad.`,
      `Is this guy bothering you, babe?!`,
      `NOTICE ME ${recipient}!!!`,
      `https://i.imgflip.com/3p9occ.png`,
      `https://pics.awwmemes.com/simp-72398942.png`,
      `Hey ${recipient} I've been stalking you for a while now... Can we go to your fav resturant?`,
      `I would dry-hump an IHOP employee for you my queen.`,
      `https://media.tenor.com/images/f6f9ba03695e71d8861cc34f485f3fa6/tenor.gif`,
      `${recipient} I will pay you $500 to kiss me *once* 😘`,
      `My queen, your Discord Nitro expired! I'll get you a year subscription, don't worry.`,
      `Do you like me back ${recipient}?`,
      `${recipient} when are you going to make an OnlyFans?`,
      `I swear I like you for your personality`,
      `${recipient} I showed you my pp, pls respond`,
      `If I could rearrange the alphabet, I’d put ‘U’ and ‘I’ together`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];

    msg.channel.send(response);
  },
};
