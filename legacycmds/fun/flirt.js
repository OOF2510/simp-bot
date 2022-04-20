module.exports = {
  name: "flirt",
  aliases: ["fl"],
  cat: "fun",
  usage: "flirt [user mention]",
  desc: "Sends a random pick-up line",
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
    db
  ) {
    let response;
    let sender = msg.author;

    let recipient = msg.mentions.users.first();
    if (!recipient) recipient = sender;
    let recMem = guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      `${recipient} do- do you wanna go to the movies or something?`,
      `${recipient} are you a volcano? Because you're hot!`,
      `Are you French? Because Eiffel for you.`,
      `${recipient} Aside from being sexy, what do you do for a living?`,
      `Dang ${recipient}, are you a parking ticket? Because you’ve got FINE written all over you.`,
      `I must be in a museum, because you truly are a work of art.`,
      `I was blinded by your beauty; I’m going to need your name and phone number for insurance purposes. ${recipient}`,
      `https://media.tenor.com/images/e08ba87623961bd2b7b5abe1a4a64483/tenor.gif`,
      `https://reactiongifs.me/wp-content/uploads/2014/04/office-darryl-philbin-quotes-im-hot-you-re-hot-lets-get-it-poppin.gif`,
      `Hey ${recipient} is your name Google? Because you have everything I’ve been searching for.`,
      `Is this the Hogwarts Express? Because it feels like you and I are headed somewhere magical.`,
      `${recipient} Do you have a BandAid? I just scraped my knee falling for you.`,
      `${recipient} well, here I am, what's your other two wishes`,
      `Hey, my name's Microsoft Windows. Can I crash at your place tonight?`,
      `You're chill ${recipient}. Let's hang.`,
      `Can I put my Minecraft bed next to yours?🥺`,
      `Do you work at Subway? cause you just gave me a footlong`,
      `I want to park my Big Mac truck in your little garage`,
      `I hope you know CPR, because you are taking my breath away!`,
      `If nothing lasts forever, will you be my nothing?`,
      `Are you from Tennessee? Because you're the only Ten I See.`,
      `Did it hurt when you fell from heaven?`,
      `Are you water? Because you're making me wet!`,
      `____, shoulders, knees, and toes. Now the only thing you have to do is give me head`,
      `Hey ${recipient}, if COVID-19 doesn't take you out, can I?`,
      `Are you a library book? Cause I'm checking you out`,
      `Are you my homework? Cause I want to slam you on the desk, promise to do you all night long, get distracted, last 2 minutes, cry, turn on the tv and continue to hate myself for another weak performance`,
      `Yes, I'm G.A.Y:
            Gonna
            Ask
            You out`,
      `${recipient} are you Italian? Cause I wanna pizza that ass`,
      `Hey ${recipient} you're pretty and I'm fucking ugly. Together we could be pretty fucking ugly`,
      `Hey ${recipient}, I shit my pants, can I get in yours?`,
      `https://tenor.com/bxtNe.gif`,
      `https://preview.redd.it/tox1ttd414441.jpg?width=640&crop=smart&auto=webp&s=94c51a816162fa1e13ec2050c76c88496a367317`,
      `Hey ${recipient}, are you a dental product?, Cause i'm wanting some oral, B`,
      `Roses are red, lemons are sour. Open your legs and give me an hour.`,
      `Are you redstone? Cause you just made my sticky piston extend`,
      `Hey ${recipient}, there's something wrong with my phone, it doesnt have your number in it`,
      `I must be a snowflake, because I've fallen for you ${recipient}.`,
      `Do you believe in love at first sight ${recipient}, or should I walk by again?`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];

    msg.channel.send(response);
  },
};
