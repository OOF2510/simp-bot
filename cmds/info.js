const si = require('systeminformation');
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
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
  name: "info",
  aliases: ["in", "inf", "information", "stats"],
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
    function isLinux() {
      let osPlat = os.platform();
      if (osPlat == "linux") return true;
      else return false;
    }

    var uptimeMilsec = os.uptime() * 1000;
    var uptime = millisecondsToStr(uptimeMilsec);
    var botUptimeMilsec = process.uptime() * 1000;
    var botUptime = millisecondsToStr(botUptimeMilsec);
    var memUsageB = process.memoryUsage().heapUsed;
    var memUsage = formatBytes(memUsageB);
    var totalSysMem = os.totalmem();
    var freeSysMem = os.freemem();
    var usedSysMem = totalSysMem - freeSysMem;
    var sysMemUsage = formatBytes(usedSysMem);
    var cpuTemp = await si.cpuTemperature();

    let Distro;
    let distro;
    if (isLinux())
      Distro = await exec('hostnamectl | grep -i "operating system"');
    if (!Distro) distro = "Error getting distro";
    else distro = Distro.stdout.trim().replace("Operating System: ", ``);

    let NodeV = await exec("node -v");
    let nodeV = NodeV.stdout.trim();

    let YayFetch = await exec("yayfetch --hide-logo");
    let yayFetch = YayFetch.stdout.trim();

    let ScreenFetch = await exec("screenfetch -N");
    let screenFetch = ScreenFetch.stdout.trim();

    let djsV = "master";

    let infoEm = new Discord.MessageEmbed()
      .setTitle("Info")
      .addFields(
        { name: "Server Info", value: "Information about the server" },
        { name: "Members", value: guild.memberCount, inline: true },
        { name: "Roles", value: guild.roles.cache.size, inline: true },
        { name: "Server ID", value: guild.id, inline: true },
        {
          name: "Server Owner",
          value: client.users.cache.get(msg.guild.ownerID),
          inline: true,
        },
        { name: `Region`, value: guild.region, inline: true },
        { name: "Default Channel", value: defChannel, inline: true },
        { name: "Prefix", value: prefix, inline: true },
        {
          name: "OS Info",
          value: `Information about the bot's OS`,
          inline: false,
        },
        { name: "Platform", value: "`" + os.platform() + "`", inline: true },
        { name: "Arch", value: "`" + os.arch() + "`", inline: true },
        { name: "Release", value: "`" + os.release() + "`", inline: true },
        { name: "Version", value: "`" + os.version() + "`", inline: true },
        { name: "Linux Distro", value: "`" + distro + "`", inline: true },
        { name: "Bot RAM Usage", value: "`" + memUsage + "`", inline: true },
        {
          name: "System RAM Usage",
          value: "`" + sysMemUsage + "`",
          inline: true,
        },
        { name: `NodeJS Version`, value: "`" + nodeV + "`", inline: true },
        { name: `Discord.js Version`, value: "`" + djsV + "`", inline: true },
        { name: `System Uptime`, value: "`" + uptime + "`", inline: true },
        { name: `Bot Uptime`, value: "`" + botUptime + "`", inline: true },
        { name: `CPU Temperature`, value: "`" + cpuTemp + "`", inline: true }
      )
      .setColor("RANDOM");

    if (args[0] == "-yayfetch") {
      infoEm.addFields({
        name: `Yayfetch`,
        value: "```yaml\n" + `${yayFetch}` + "```",
        inline: true,
      });

      channel.send(infoEm);
    } else if (args[0] == "-screenfetch") {
      infoEm.addFields({
        name: `Screenfetch`,
        value: "```yaml\n" + `${screenFetch}` + "```",
        inline: true,
      });

      channel.send(infoEm);
    } else {
      channel.send(infoEm);
    }
  },
};
