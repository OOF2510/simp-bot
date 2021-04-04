module.exports = {
  name: "nobroadcast",
  aliases: ["nbr"],
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
    niDB,
    bchDB,
    blDB
  ) {
    if (!msg.member.hasPermission("MANAGE_GUILD"))
      return msg.reply("You don't have permissions to do that!");

    let disabled = await nbDB.get(guild.id);

    if (disabled)
      return channel.send("Broadcasts are already disabled for this server!");

    await nbDB.set(guild.id, "true");

    const nobEm = new Discord.MessageEmbed()
      .setAuthor(botNick, client.user.avatarURL())
      .setColor("RANDOM")
      .setTitle(`Broadcasts disabled!`)
      .setDescription(
        `Broadcasts have been successfully disabled for this server!`
      )
      .setTimestamp();

    channel.send(nobEm);
  },
};
