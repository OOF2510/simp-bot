const Discord = require('discord.js')

module.exports = {
    name: 'help',
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
        Discord) {
        if (!args[0]) {
        const hIEm = new Discord.MessageEmbed()
          .setAuthor(botNick, client.user.avatarURL())
          .setColor('RANDOM')
          .setTitle('Help')
          .setDescription(`Use ${prefix}help <module> for more info`)
          .addFields(
            { name: `List of modules`, value: `
            \`Fun\`
            \`Settings\`
            \`Info\`
            \`Moderation\`
            \`Feedback\`
            \`Misc\`` },
          )
          .setTimestamp();

          channel.send(hIEm)
      } else if (args[0].toLowerCase() == 'settings') {
        let setEm = new Discord.MessageEmbed()
          .setAuthor(botNick, client.user.avatarURL())
          .setTitle('Help - Settings')
          .addFields(
            { name: 'Prefix', value: `${prefix}prefix <new prefix> - Sets new prefix` },
            { name: `No Broadcast`, value: `${prefix}nobroadcast - Disables broadcasts for your server` },
            { name: `Yes Broadcast`, value: `${prefix}yesbroadcast - Re-enables broacasts for your server` },
            { name: `Set Broadcast Channel`, value: `${prefix}setbroadcastchannel <channel mention> - Sets the channel that annoucements go to in your server!` }
          )
          .setColor('RANDOM')

          channel.send(setEm)
      } else if (args[0].toLowerCase() == 'info') {
        let inEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Info')
        .addFields(
          { name: 'Ping', value: `${prefix}ping - Pings the bot` },
          { name: 'Help', value: `${prefix}help <module> - Sends help embed` },
          { name: 'Info', value: `${prefix}info - Info about the bot and server` },
          { name: `Avatar`, value: `${prefix}avatar [optional user mention] - Sends user's avatar` },
          { name: `Support`, value: `${prefix}support - Join the support server!` }
        )
        .setColor('RANDOM')

        channel.send(inEm)
      } else if (args[0].toLowerCase() == 'feedback') {
        let fbEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Feedback')
        .addFields(
          { name: `Suggest`, value: `${prefix}suggest <suggestion> - Sends your suggestion to my devoloper` },
          { name: `Bug report`, value: `${prefix}bugreport <report> - Sends a bug report to my devoloper` },
          { name: `Support`, value: `${prefix}support - Join the support server!` }
        )
        .setColor('RANDOM')

        channel.send(fbEm)
      } else if (args[0].toLowerCase() == 'fun') {
        let funEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Fun')
        .addFields(
          { name: 'Simp', value: `${prefix}simp [optional user mention] - Sends a random simp image/message/gif` },
          { name: 'Flirt', value: `${prefix}flirt [optional user mention] - Sends a random pick-up line.`},
          { name: 'Frick', value: `${prefix}frick [optional user mention] - I think we all know what that does...` },
          { name: 'Pp', value: `${prefix}pp [optional user mention] - Pp size` }
        )
        .setColor('RANDOM')

        channel.send(funEm)
      } else if (args[0].toLowerCase() == 'misc') {
        let miEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Misc')
        .addFields(
          { name: `Invite`, value: `${prefix}Invite - Sends my invite link` }
        )
        .setColor('RANDOM')

        channel.send(miEm)
      } else if (args[0].toLowerCase() == 'dev' || 'whitelisted') {
        let deEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Dev-level/Whitelist-level commands')
        .addFields(
          { name: 'Restart', value: `${prefix}restart - Restarts the bot` },
          { name: 'Serverlist', value: `${prefix}serverlist - Will show info about every server the bot is in. dont use in public channels!` },
          { name: 'Run Command', value: `${prefix}runcmd <terminal command> - Will run the specified command and return the output` },
          { name: 'Blacklist', value: `${prefix}broadcast <user mention> - Stops specified user from using the bot` },
          { name: 'Un-Blacklist', value: `${prefix}unblacklist <user mention> - Un-blacklists the specified user` }
        )
        .setColor('RANDOM')

        channel.send(deEm)
      } else if (args[0].toLowerCase() == 'moderation' || 'mod') {
        let modEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle('Help - Moderation')
        .addFields(
          { name: `Purge`, value: `${prefix}purge <number of messages to delete> - Deletes specified number of messages` }
        )
        .setColor('RANDOM')

        channel.send(modEm)
      } else return;
    }
}