module.exports = {
  name: "help",
  aliases: ["h"],
  cat: "info",
  usage: "help <module>",
  desc: "Sends help embed",
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
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "settings") {
          setEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(setEm);
    } else if (args[0].toLowerCase() == "info") {
      let inEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Info")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "info") {
          inEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(inEm);
    } else if (args[0].toLowerCase() == "feedback") {
      let fbEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Feedback")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "feedback") {
          fbEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(fbEm);
    } else if (args[0].toLowerCase() == "fun") {
      let funEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Fun")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "fun") {
          funEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(funEm);
    } else if (args[0].toLowerCase() == "misc") {
      let miEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Misc")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "misc") {
          miEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(miEm);
    } else if (args[0].toLowerCase() == "dev") {
      let deEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Dev-level/Whitelist-level commands")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "dev") {
          deEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(deEm);
    } else if (args[0].toLowerCase() == "moderation") {
      let modEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Moderation")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "moderation") {
          modEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(modEm);
    } else if (args[0].toLowerCase() == "music") {
      let muEm = new Discord.MessageEmbed()
        .setAuthor(botNick, client.user.avatarURL())
        .setTitle("Help - Music")
        .setColor(config.embedColor);

      client.commands.forEach((cmd) => {
        if (cmd.cat.toLowerCase() == "music") {
          muEm.addFields({
            name: cmd.name,
            value: `${prefix}${cmd.usage} - ${cmd.desc}`,
          });
        }
      });

      channel.send(muEm);
    } else return;
  },
};
