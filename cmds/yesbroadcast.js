module.exports = {
  name: "yesbroadcast",
  aliases: ["ybr", "yesbr"],
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
    if (!msg.member.permissions.has("MANAGE_GUILD"))
      return msg.reply("You don't have permissions to do that!");

    let disabled = await nbDB.get(guild.id);

    if (!disabled)
      return channel.send(`Broadcasts aren't disabled for this server!`);

    await nbDB.delete(guild.id);

    const nobEm = new Discord.MessageEmbed()
      .setAuthor(botNick, client.user.avatarURL())
      .setColor("RANDOM")
      .setTitle(`Broadcasts enabled!`)
      .setDescription(
        `Broadcasts have been successfully re-enabled for this server!`
      )
      .setTimestamp();

    channel.send(nobEm);
  },
};
