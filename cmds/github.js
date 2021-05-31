module.exports = {
  name: "github",
  aliases: ["git", "source", "code", "gh", "src"],
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
    let button = new client.buttons.MessageButton()
      .setLabel("View Source Code on Github")
      .setStyle("url")
      .setURL("https://github.com/oof2510/simp-bot-rewritten");

    channel.send(button);
  },
};
