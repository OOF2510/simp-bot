module.exports = {
  name: "servercount",
  aliases: ["sc", "servers"],
  cat: "misc",
  usage: "servercount",
  desc: "Returns the amount of servers simp bot is in",
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
    msg.reply(`Simp Bot is in ${client.guilds.cache.size} servers`);
  },
};
