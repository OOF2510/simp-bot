module.exports = {
  name: "blacklist",
  aliases: ["bl"],
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

    let blacklisted = await blDB.get(uID);
    if (blacklisted) return channel.send(`${u} is already blacklisted!`);

    await blDB.set(uID, "true");

    msg.channel.send(`Blacklisted ${u}`);
  },
};
