module.exports = {
  name: "help",
  aliases: ["h"],
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
    if (!args[0]) {
      const hIEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setColor("RANDOM")
        .setTitle("Help")
        .setDescription(`Use ${prefix}help <module> for more info`)
        .addFields({
          name: `List of modules`,
          value: `
            \`Fun\`
            \`Settings\`
            \`Info\`
            \`Moderation\`
            \`Feedback\`
            \`Misc\`
            \`Music\``,
        })
        .setTimestamp();

      channel.send(hIEm);
    } else if (args[0].toLowerCase() == "settings") {
      let setEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Settings")
        .addFields(
          {
            name: "Prefix",
            value: `${prefix}prefix <new prefix> - Sets new prefix`,
          },
          {
            name: `No Broadcast`,
            value: `${prefix}nobroadcast - Disables broadcasts for your server`,
          },
          {
            name: `Yes Broadcast`,
            value: `${prefix}yesbroadcast - Re-enables broacasts for your server`,
          },
          {
            name: `Set Broadcast Channel`,
            value: `${prefix}setbroadcastchannel <channel mention> - Sets the channel that annoucements go to in your server!`,
          }
        )
        .setColor("RANDOM");

      channel.send(setEm);
    } else if (args[0].toLowerCase() == "info") {
      let inEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Info")
        .addFields(
          { name: "Ping", value: `${prefix}ping - Pings the bot` },
          { name: "Help", value: `${prefix}help <module> - Sends help embed` },
          {
            name: "Info",
            value: `${prefix}info [-yayfetch] - Info about the bot and server`,
          },
          {
            name: `Avatar`,
            value: `${prefix}avatar [optional user mention] - Sends user's avatar`,
          },
          {
            name: `Support`,
            value: `${prefix}support - Join the support server!`,
          },
          { name: `Aliases`, value: `${prefix}aliases <command>` },
          {
            name: `Github`,
            value: `${prefix}github - Sends link to Simp Bot's github page`,
          }
        )
        .setColor("RANDOM");

      channel.send(inEm);
    } else if (args[0].toLowerCase() == "feedback") {
      let fbEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Feedback")
        .addFields(
          {
            name: `Suggest`,
            value: `${prefix}suggest <suggestion> - Sends your suggestion to my devoloper`,
          },
          {
            name: `Bug report`,
            value: `${prefix}bugreport <report> - Sends a bug report to my devoloper`,
          },
          {
            name: `Support`,
            value: `${prefix}support - Join the support server!`,
          }
        )
        .setColor("RANDOM");

      channel.send(fbEm);
    } else if (args[0].toLowerCase() == "fun") {
      let funEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Fun")
        .addFields(
          {
            name: "Simp",
            value: `${prefix}simp [optional user mention] - Sends a random simp image/message/gif`,
          },
          {
            name: "Flirt",
            value: `${prefix}flirt [optional user mention] - Sends a random pick-up line.`,
          },
          {
            name: "Frick",
            value: `${prefix}frick [optional user mention] - I think we all know what that does...`,
          },
          {
            name: "Pp",
            value: `${prefix}pp [optional user mention] - Pp size`,
          },
          {
            name: "Youtube Together",
            value: `${prefix}youtubetogether - Starts a Youtube together session (may not work on mobile)`,
          },
          {
            name: "Poker Together",
            value: `${prefix}poker - Starts a Poker together session (may not work on mobile)`,
          },
          {
            name: "Chess Together",
            value: `${prefix}chess - Starts a Chess together session (may not work on mobile)`,
          }
        )
        .setColor("RANDOM");

      channel.send(funEm);
    } else if (args[0].toLowerCase() == "misc") {
      let miEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Misc")
        .addFields(
          {
            name: `Invite`,
            value: `${prefix}Invite - Sends my invite link`,
          },
          {
            name: "Email",
            value: `${prefix}email <recipent email> <message> - Sends an email to the specified email address`,
          },
          {
            name: `Math`,
            value: `${prefix}math <num1> <operator> <num2> - Does the specified math equation`,
          },
          {
            name: "Shorten URL",
            value: `${prefix}shortenurl <url> - Shortens given url`,
          }
        )
        .setColor("RANDOM");

      channel.send(miEm);
    } else if (args[0].toLowerCase() == "dev") {
      let deEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Dev-level/Whitelist-level commands")
        .addFields(
          { name: "Restart", value: `${prefix}restart - Restarts the bot` },
          {
            name: "Serverlist",
            value: `${prefix}serverlist - Will show info about every server the bot is in. dont use in public channels!`,
          },
          {
            name: "Run Command",
            value: `${prefix}runcmd <terminal command> - Will run the specified command and return the output`,
          },
          {
            name: "Blacklist",
            value: `${prefix}broadcast <user mention> - Stops specified user from using the bot`,
          },
          {
            name: "Un-Blacklist",
            value: `${prefix}unblacklist <user mention> - Un-blacklists the specified user`,
          }
        )
        .setColor("RANDOM");

      channel.send(deEm);
    } else if (args[0].toLowerCase() == "moderation") {
      let modEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Moderation")
        .addFields({
          name: `Purge`,
          value: `${prefix}purge <number of messages to delete> - Deletes specified number of messages`,
        })
        .setColor("RANDOM");

      channel.send(modEm);
    } else if (args[0].toLowerCase() == "music") {
      let muEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Music")
        .addFields(
          {
            name: "Play",
            value: `${prefix}play <song name or url> - Plays specified song`,
          },
          {
            name: "Playlist",
            value: `${prefix}playlist <playlist url> - Adds specified playlist to queue`,
          },
          {
            name: "Now Playing",
            value: `${prefix}nowplaying - Shows the currently playing song`,
          },
          {
            name: "Skip",
            value: `${prefix}skip - Skips the currently playing song`,
          },
          {
            name: "Remove",
            value: `${prefix}remove <queue number> - Removes specified song from queue`,
          },
          {
            name: "Pause",
            value: `${prefix}pause - Pauses the current song`,
          },
          {
            name: "Resume",
            value: `${prefix}resume - Resumes paused song`,
          },
          {
            name: "Stop",
            value: `${prefix}stop - Stops playing music & leaves the VC`,
          },
          {
            name: "Shuffle",
            value: `${prefix}shuffle - Shuffles the queue`,
          },
          {
            name: "Queue",
            value: `${prefix}queue - Shows the queue`,
          },
          {
            name: "Volume",
            value: `${prefix}volume <number from 0 to 200> - Sets volume to specified percent`,
          }
        )
        .setColor("RANDOM");

      channel.send(muEm);
    } else return;
  },
};
