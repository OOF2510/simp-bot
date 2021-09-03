const milsecConvert = require("../util/convertMilsec");

module.exports = {
  name: "whois",
  aliases: ["wi"],
  cat: "info",
  usage: "whois [user mention|user id|username|nickname]",
  desc: "Gets info about a user",
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
    let mem =
      msg.mentions.members.first() ||
      msg.guild.members.cache.get(args[0]) ||
      msg.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      msg.guild.members.cache.find(
        (ro) => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      msg.member;
    let user = mem.user

    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var AccCreated = user.createdAt;
    let accCreated = AccCreated.toLocaleDateString("en-US", options);

    var today = new Date();

    var AccAge = today.getTime() - AccCreated.getTime();
    let accAge = milsecConvert(AccAge);

    var MemJoined = mem.joinedAt;
    let memJoined = MemJoined.toLocaleDateString("en-US", options);

    var MemAge = today.getTime() - MemJoined.getTime();
    let memAge = milsecConvert(MemAge);

    let av = user.avatarURL({ dynamic: true });

    let flags = await user.fetchFlags();
    var Badges = flags.toArray();
    if (user.avatar && user.avatar.startsWith("a_")) Badges.push("NITRO");
    let badges;
    if (Badges.length == 0) badges = "No badges";
    else badges = Badges.join(", ");

    let wiEm = new Discord.MessageEmbed()
      .setAuthor(user.tag, av)
      .setDescription(`${user}`)
      .setThumbnail(av)
      .setColor(config.embedColor)
      .addFields(
        { name: "User ID", value: `${user.id}`, inline: true },
        {
          name: "Account Created",
          value: `${accCreated} (${accAge} ago)`,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `${memJoined} (${memAge} ago)`,
          inline: true,
        },
        { name: "Bot?", value: `${user.bot}`, inline: true },
        { name: "Badges", value: `${badges}`, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [wiEm] });
  },
};
