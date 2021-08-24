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
    db
  ) {
    if (!allowed.includes(author.id))
      return msg.channel.send(`nononononononononono`);

    let u = msg.mentions.users.first();
    if (!u) return channel.send(`Mention a user!`);
    let uID = u.id;

    let blacklisted = db.get("user_id", config.mysql.schema, "blacklist", "user_id", uID);
    if (!blacklisted) return channel.send(`${u} isn't blacklisted!`);

    await db.query(`DELETE FROM ${config.mysql.schema}.\`blacklist\` WHERE (\`user_id\` = ${uID});`)

    msg.channel.send(`Unblacklisted ${u}`);
  },
};
