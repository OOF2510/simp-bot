module.exports = {
  name: "unblacklist",
  aliases: ["ubl", "unbl"],
  cat: "dev",
  usage: "unblacklist <user mention>",
  desc: "Removes specified user from the blacklist",
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
    if (!allowed.includes(author.id))
      return msg.channel.send(`nononononononononono`);

    let u = msg.mentions.users.first();
    if (!u) return channel.send(`Mention a user!`);
    let uID = u.id;

    let blacklisted = blDB.get(uID);
    if (!blacklisted) return channel.send(`${u} isn't blacklisted!`);

    await blDB.delete(uID);

    msg.channel.send(`Unblacklisted ${u}`);
  },
};
