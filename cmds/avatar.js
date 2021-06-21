module.exports = {
  name: "avatar",
  aliases: ["av"],
  cat: "info",
  usage: "avatar [user mention]",
  desc: "Gets a user's avatar",
  execute(
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
    let user = msg.mentions.users.first();
    if (!user) user = author;
    let mem = guild.members.cache.get(user.id);

    let userNick = mem ? mem.displayName : user.username;

    let av = user.avatarURL({ dynamic: true, size: 512 });

    let avEm = new Discord.MessageEmbed()
      .setTitle(`${userNick}'s Avatar`)
      .setImage(av)
      .setColor(config.embedColor)
      .setTimestamp();

    channel.send(avEm);
  },
};
