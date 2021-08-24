module.exports = {
  name: "poker",
  aliases: ["pokertogether", "vc-poker"],
  cat: "fun",
  usage: "poker",
  desc: "Starts a Poker Together session (may not work on mobile)",
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
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a Voice Channel to use this!");
    client.discordTogether
      .createTogetherCode(msg.member.voice.channelID, "poker")
      .then(async (invite) => {
        return msg.reply(`<${invite.code}>`);
      });
  },
};
