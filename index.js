const Discord = require("discord.js");
const config = require("./config.json");
const express = require('express');
const url = require('url');
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const disPassport = require('passport-discord');
const Strategy = disPassport.Strategy;
const ejs = require("ejs");
const session = require("express-session");
const MemoryStore = require("memorystore");
const memStore = MemoryStore(session);
const os = require('os');
const mongoose = require('mongoose');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

const prefix = config.prefix;

var allowed = [
  '463119138500378624', //me
  '760473112613093436', //gavin
  '793910661293801524', //robbie
  '463119267832004620' //noah
]
var Long = require('long');
var bodyParser = require("body-parser");

const getDefaultChannel = (guild) => {

  const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
  if (generalChannel)
    return generalChannel;

    if(guild.channels.cache.has(guild.id))
    return guild.channels.cache.get(guild.id)

  return guild.channels.cache
   .filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
   .sort((a, b) => a.position - b.position ||
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
   .first();
}

const client = new Discord.Client();

client.once("ready", () => {
    console.log("Ready!");
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(client);
    client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, { type: 'WATCHING' });
    console.log(client.user.tag);
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnected :(");
});

client.on('message', async msg => {
      let channel = msg.channel;
      let author = msg.author;
      let server = msg.guild;
      let guild = server;
      let botMem = server.member(client.user);
      let botNick = botMem ? botMem.displayName : client.user.username;
      let testServer = client.guilds.cache.get('786722539250516007');
      let defChannel = getDefaultChannel(server);
      let me = client.users.cache.get('463119138500378624');

      if (author.bot) return;
      if (channel.type === "dm") return;

      let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

      if (!prefixes[msg.guild.id]) {
        prefixes[msg.guild.id] = {
          prefixes: config.prefix
        };
      }
      let prefix = prefixes[msg.guild.id].prefixes;

      const args = msg.content.slice(prefix.length).trim().split(' ');

    if (msg.content === `${prefix}ping`) {
      msg.reply(`Pong UwU, (${client.ws.ping}ms)`)
    } else if (msg.content.startsWith(`${prefix}simp`)) {
        let response;
        let sender = msg.author;
        
        const recipient = msg.mentions.users.first();
        
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
            `If I could rearrange the alphabet, I’d put ‘U’ and ‘I’ together`
          ];

          response = responses[Math.floor(Math.random() * responses.length)];

          msg.channel.send(response);
    } else if (msg.content.startsWith(`${prefix}flirt`)) {
        let response;
        let sender = msg.author;

        const recipient = msg.mentions.users.first();

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
            `Are you the brown M&M? Cause I wanna fuck you`,
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
            `Hey ${recipient}, are you retarted? Cuz someone told me you have a crush on me`,
            `Hey ${recipient}, nice shoes, wanna fuck?`,
            `Roses are red, lemons are sour. Open your legs and give me an hour.`,
            `Are you redstone? Cause you just made my sticky piston extend`,
            `Hey ${recipient}, there's something wrong with my phone, it doesnt have your number in it`,
            `I must be a snowflake, because I've fallen for you ${recipient}.`,
            `Do you believe in love at first sight ${recipient}, or should I walk by again?`
          ];

          response = responses[Math.floor(Math.random() * responses.length)];

          msg.channel.send(response);
    } else if (msg.content.startsWith(`${prefix}help`)) {
        const helpEmbed = new Discord.MessageEmbed()
  .setColor('#0099CC')
  .setTitle(`${botNick} Help`)
  .setAuthor(botNick, client.user.avatarURL())
  .addFields(
    { name: 'Ping', value: `${prefix}ping - Pings the bot` },
    { name: 'Simp', value: `${prefix}simp <user mention> - Sends a random simp image/message/gif` },
    { name: 'Flirt', value: `${prefix}flirt <user mention> - Sends a random pick-up line.`},
    { name: 'Frick', value: `${prefix}frick <user mention> - I think we all know what that does...` },
    { name: 'Help', value: `${prefix}help - Brings up this menu` },
    { name: 'Pp', value: `${prefix}pp [optional user mention] - Pp size` },
    { name: 'Prefix', value: `${prefix}prefix <new prefix> - Sets new prefix` },
    { name: `Suggest`, value: `${prefix}suggest <suggestion> - Sends your suggestion to my devoloper` },
    { name: `Bug report`, value: `${prefix}bugreport <report> - Sends a bug report to my devoloper` },
    { name: `Invite`, value: `${prefix}Invite - Sends my invite link` },
    { name: 'Info', value: `${prefix}info - Info about the bot and server` }
  )
  .setTimestamp();
  msg.channel.send(helpEmbed);
    } else if (msg.content.startsWith(`${prefix}frick`)) {
        let response;
        let sender = msg.author;

        const recipient = msg.mentions.users.first();

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
            `${sender} and ${recipient} do some not very christian things together`
          ];

          response = responses[Math.floor(Math.random() * responses.length)];

          msg.channel.send(response);
    } else if (msg.content.startsWith(`${prefix}pp`)) {
      let response;
      let sender = msg.author;

      const recipient = msg.mentions.users.first();
      const recMem = msg.mentions.members.first();

        if (!recipient) {
          const recipient = sender;
          const recMem = msg.member;
          let recNick = recMem ? recMem.displayName : recipient.username;
          let responses = [
            '8D',
            '8=D',
            '8==D',
            '8===D',
            '8====D',
            '8=====D',
            '8======D',
            '8=======D',
            '8========D',
            '8=========D',
            '8==========D',
            '8===========D'
          ];

          if (recipient.id === '463119138500378624')  {
            //me
            response = '8======================================================D';
            const ppEm = new Discord.MessageEmbed()
          .setColor('RANDOM')
          .addFields (
            {name: `${recNick}'s pp`, value: `${response}`}
          )
  
            msg.channel.send(ppEm);
          } else {

          response = responses[Math.floor(Math.random() * responses.length)];

          const ppEm = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addFields (
          {name: `${recNick}'s pp`, value: `${response}`}
        )

          msg.channel.send(ppEm);
        }
        } else {
        let recNick = recMem ? recMem.displayName : recipient.username;

        let responses = [
          '8D',
          '8=D',
          '8==D',
          '8===D',
          '8====D',
          '8=====D',
          '8======D',
          '8=======D',
          '8========D',
          '8=========D',
          '8==========D',
          '8===========D'
        ];

        if (recipient.id === '463119138500378624') {
          response = '8======================================================D';
          const ppEm = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addFields (
          {name: `${recNick}'s pp`, value: `${response}`}
        )

          msg.channel.send(ppEm);
        } else {

        response = responses[Math.floor(Math.random() * responses.length)];

        const ppEm = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addFields (
          {name: `${recNick}'s pp`, value: `${response}`}
        )

          msg.channel.send(ppEm);
        }
      }
    } else if (msg.content.startsWith(`${prefix}prefix`)) {

      if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.reply("You don't have permissions to do that!")
      if(!args[1]) return msg.reply(`Usage: ${prefix}prefix <new prefix>`)

      let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    
      prefixes[msg.guild.id] = {
        prefixes: args[1]
      };

      fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err)
      });

      let prefixEm = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Prefix Set!")
      .setDescription(`Prefix set to ${args[1]}`);

      channel.send(prefixEm);

    } else if (msg.content.startsWith(`${prefix}suggest`)) {
      const sugCh = client.channels.cache.get('816823026384633887');
      const sugCh2 = client.channels.cache.get('816828453110022166');
      const sug = msg.content.replace(`${prefix}suggest`,``);

      const sugEm = new Discord.MessageEmbed()
        .setTitle(`New suggestion`)
        .addFields(
          { name: `Suggestion:`, value:`${sug}` }
        )
        .setFooter(`Suggested by: ${msg.author.tag}`, msg.author.avatarURL())
        .setColor('RANDOM')
        .setTimestamp()
      
      sugCh.send(sugEm);
      sugCh2.send(sugEm);

      msg.reply(`I have sent your suggestion, queen!`);

    } else if (msg.content.startsWith(`${prefix}restart`)) {
      if (allowed.includes(author.id)) {
        msg.reply(`Restarting UwU!`);
        client.destroy();
        client.login(config.token);
        client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, { type: 'WATCHING' });
        console.log(`Restarted because ${msg.author.username} told me to!`);
        setTimeout(() => { msg.channel.send(`Successfully restarted!`); }, 2000);
      } else {
        msg.reply(`Only the developer & certian whitelisted users can do that!`)
      }
    } else if (msg.content.startsWith(`${prefix}bugreport`)) {
      const repCh = client.channels.cache.get('817885616791355404');
      const repCh2 = client.channels.cache.get('817885785637257216');
      const rep = msg.content.replace(`${prefix}bugreport`,``);

      const repEm = new Discord.MessageEmbed()
        .setTitle(`New bug report`)
        .addFields(
          { name: `Report:`, value:`${rep}` }
        )
        .setFooter(`Reported by: ${msg.author.tag}`, msg.author.avatarURL())
        .setColor('RANDOM')
        .setTimestamp()
      
      repCh.send(repEm);
      repCh2.send(repEm);

      msg.reply(`I have sent your bug report, queen!`);
    } else if (msg.content.startsWith(`${prefix}invite`)) {
      msg.reply(`Here's my invite link: <https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot>`)
    } else if (msg.content.startsWith(`${prefix}serverlist`)) {
      if (allowed.includes(author.id)) {
      channel.send(`${client.guilds.cache.size} servers:`)

      client.guilds.cache.forEach(guild => {
        let owner = guild.ownerID;
        let defC = getDefaultChannel(guild);
        async function sendSL() {
        let invite = await defC.createInvite(
          {
            maxAge: 10 * 60 * 1000,
            maxUses: 1
          });
          let inv = invite ? `<${invite}>` : `Error creating invite`
          let devSlEm = new Discord.MessageEmbed()
          .setTitle(guild.name)
          .setDescription(guild.id)
          .setColor('RANDOM')
          .addFields(
            { name: `Member count`, value: guild.memberCount, inline: true },
            { name: `Owner ID`, value: owner, inline: true },
            { name: `Invite`, value: inv, inline: true }
          )
          channel.send(devSlEm);
        }
        sendSL();
      })
      } else {
        let slEm = new Discord.MessageEmbed()
      .setTitle(`Server Count`)
      .setDescription(`${client.user.username} is in **${client.guilds.cache.size}** servers!`)
      .setColor('RANDOM')
      .setFooter(`Requested by ${msg.author.username}`, msg.author.displayAvatarURL());

      msg.channel.send(slEm);
      }
    } else if (msg.content.startsWith(`${prefix}broadcast`)) {
      if (allowed.includes(author.id)) {

        let message = msg.content.replace(`${prefix}broadcast`,``);

        if (!message) return msg.channel.send(`Can't send an empty message!`)

        let broadcastEm = new Discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle(`A message from my developer:`)
          .setDescription(message)
          .setFooter(author.username, author.avatarURL())
          .setTimestamp();

        client.guilds.cache.forEach(async guild => {
          let defC = getDefaultChannel(guild)
          defC.send(broadcastEm);
        })

      } else {
        channel.send(`Only the developer & certian whitelisted users can use that command!`)
      }
    } else if (msg.content.startsWith(`${prefix}info`)) {
      var uptime = os.uptime() / 60
      var up = Math.round(uptime);
      let infoEm = new Discord.MessageEmbed()
        .setTitle('Info')
        .addFields(
          { name:'Server Info', value:'Information about the server'},
          { name:'Members', value:guild.memberCount, inline:true },
          { name:'Server ID', value:guild.id, inline:true },
          { name:'Server Owner', value:guild.owner, inline:true },
          { name:'Default Channel', value:defChannel, inline:true },
          { name:'OS Info', value:`Information about the bot's OS`, inline:false },
          { name:'Type', value:'`' + os.type() + '`', inline:true },
          { name:'Arch', value:'`' + os.arch() + '`', inline:true },
          { name:'Release', value:'`' + os.release() + '`', inline:true },
          { name:'Version', value:'`' + os.version() + '`', inline:true }, 
          { name: `Uptime`, value:'`' + up + 'mins`', inline:true  },
        )
        .setColor('RANDOM')
        
      channel.send(infoEm)
    } else if (msg.content.startsWith(`${prefix}runcmd`)) {
      if (!allowed.includes(author.id)){
        channel.send(`Only the developer & certian whitelisted users can use that command!`)
      } else {
      let cmd = msg.content.replace(`${prefix}runcmd`, ``)
      const Out = await exec(`${cmd}`)
      const out = Out.stdout.trim();

      channel.send('```bash' + `
      ${out}` + '```')
      }
    } else return;
});

client.on('guildCreate', async guild => {
  let addCh = client.channels.cache.get('821862422952411146')
  let owner = guild.ownerID;
  let defC = getDefaultChannel(guild);
  async function sendSI() {
    let invite = await defC.createInvite(
      {
        maxAge: 10 * 60 * 1000,
        maxUses: 1
      });
    let inv = invite ? `<${invite}>` : `Error creating invite`
    let SIEm = new Discord.MessageEmbed()
      .setTitle(guild.name)
      .setDescription(guild.id)
      .setColor('RANDOM')
      .addFields(
          { name: `Member count`, value: guild.memberCount, inline: true },
          { name: `Owner ID`, value: owner, inline: true },
          { name: `Invite`, value: inv, inline: true }
        )
          addCh.send(SIEm);
  }
  sendSI();
  client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, { type: 'WATCHING' });
  defC.send("Thanks for adding me UwU, you can see my commands by doing `s!help`");
})

client.login(config.token);