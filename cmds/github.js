module.exports = {
  name: "github",
  aliases: ["git", "source", "code", "gh", "src"],
  cat: "info",
  usage: "github",
  desc: "Sends link to Simp Bot's Github page",
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
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setStyle("LINK")
        .setLabel("GitHub")
        .setURL("https://github.com/OOF2510/simp-bot-rewritten")
    );

    channel.send({
      content: "Click the button below to go to Simp Bot's Github repo!",
      components: [row],
    });
  },
};
