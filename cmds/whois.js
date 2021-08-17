function milsecConvert(milliseconds) {
var seconds = {},
    minutes = {},
    hours   = {},
    days    = {},
    months  = {},
    years   = {};

seconds.val = Math.floor(milliseconds / 1000)
minutes.val = Math.floor(seconds.val / 60)
hours.val   = Math.floor(minutes.val / 60)
days.val    = Math.floor(hours.val / 24)
months.val  = Math.floor(days.val / 30)
years.val   = Math.floor(days.val / 365);

seconds.val %= 60;
minutes.val %= 60;
hours.val %= 24;
days.val %= 30;
months.val %= 12;

seconds.name = "sec"
minutes.name = "min"
hours.name = "hr"
days.name = "day"
months.name = "month"
years.name = "yr"

var units = [years, months, days, hours, minutes, seconds]
var toReturn = []

for (const unit of units) {
  if (unit.val === 1) toReturn.push(`${unit.val} ${unit.name}`)
  else if (unit.val > 1) toReturn.push(`${unit.val} ${unit.name}s`)
}

let str = toReturn.join(", ")
return str
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
