module.exports = {
  name: "chess",
  aliases: ["chesstogether", "vc-chess"],
  cat: "fun",
  usage: "chess",
  desc: "Starts a Chess Together session (may not work on mobile)",
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
      .createTogetherCode(msg.member.voice.channelID, "chess")
      .then(async (invite) => {
        return msg.reply(`<${invite.code}>`);
      });
  },
};
