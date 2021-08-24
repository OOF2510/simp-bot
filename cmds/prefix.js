module.exports = {
  name: "prefix",
  cat: "settings",
  usage: "prefix <new prefix>",
  desc: "Sets new prefix",
  aliases: ["pre"],
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
    if (!msg.member.permissions.has("MANAGE_GUILD"))
      return msg.reply("You don't have permissions to do that!");
    if (!args[0]) return msg.reply(`Usage: ${prefix}prefix <new prefix>`);

    await db.query(`INSERT INTO ${config.mysql.schema}.\`prefix\` (\`server_id\`, \`prefix\`) VALUES (${guild.id}, ${args[0]});`);

    let prefixEm = new Discord.MessageEmbed()
      .setColor(config.embedColor)
      .setTitle("Prefix Set!")
      .setDescription(`Prefix set to ${args[0]}`);

    channel.send({ embeds: [prefixEm] });
  },
};
