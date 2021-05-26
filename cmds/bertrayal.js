module.exports = {
    name: "betrayal",
    aliases: ["betrayaltogether", "vc-betrayal", "amogus"],
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
      if (!msg.member.voice.channel)
        return msg.reply("You must be in a Voice Channel to use this!");
      client.discordTogether
        .createTogetherCode(msg.member.voice.channelID, "betrayal")
        .then(async (invite) => {
          return msg.reply(`<${invite.code}>`);
        });
    },
  };
  