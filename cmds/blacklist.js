module.exports = {
  name: "blacklist",
  aliases: ["bl"],
  cat: "dev",
  usage: "blacklist <user mention>",
  desc: "Stops specified user from using the bot",
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

    let blacklisted = await db.get(
      "user_id",
      config.mysql.schema,
      "blacklist",
      "user_id",
      uID
    );
    if (blacklisted) return channel.send(`${u} is already blacklisted!`);

    await db.query(
      `INSERT INTO ${config.mysql.schema}.\`blacklist\` (\`user_id\`) VALUES (${uID});`
    );

    msg.channel.send(`Blacklisted ${u}`);
  },
};
