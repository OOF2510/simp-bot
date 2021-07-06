function millisecondsToStr(milliseconds) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();

  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }

  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  var seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return "less than a second"; //'just now' //or other string you like;
}
module.exports = {
  name: "whois",
  aliases: ["wi"],
  cat: "info",
  usage: "whois [user mention]",
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
    preDB,
    nbDB,
    bchDB,
    blDB
  ) {
    let user = msg.mentions.users.first();
    if (!user) user = author;
    let mem = guild.members.cache.get(user.id);

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
    let accAge = millisecondsToStr(AccAge);

    var MemJoined = mem.joinedAt;
    let memJoined = MemJoined.toLocaleDateString("en-US", options);

    var MemAge = today.getTime() - MemJoined.getTime();
    let memAge = millisecondsToStr(MemAge);

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
          value: `${accCreated} (~${accAge} ago)`,
          inline: true,
        },
        {
          name: "Joined Server",
          value: `${memJoined} (~${memAge} ago)`,
          inline: true,
        },
        { name: "Bot?", value: `${user.bot}`, inline: true },
        { name: "Badges", value: `${badges}`, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [wiEm] });
  },
};
