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
    const gitEm = new Discord.MessageEmbed()
      .setTitle("View the source code on GitHub!")
      .setURL("https://github.com/OOF2510/simp-bot-rewritten")
      .setColor(config.embedColor)

    channel.send(gitEm);
  },
};
