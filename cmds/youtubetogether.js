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
    client.discordTogether
      .createTogetherCode(msg.member.voice.channelID, "youtube")
      .then(async (invite) => {
        return msg.reply(`<${invite.code}>`);
      });
  },
};
