module.exports = {
  name: "youtubetogether",
  aliases: ["ytt", "yt", "youtubet", "youtube", "yttogether", "yt-together"],
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
      .createTogetherCode(msg.member.voice.channelID, "youtube")
      .then(async (invite) => {
        return msg.reply(`<${invite.code}>`);
      });
  },
};
