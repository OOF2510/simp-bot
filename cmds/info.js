const si = require("systeminformation");
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
function millisecondsToStr(milliseconds) {
  var seconds = {},
    minutes = {},
    hours = {},
    days = {},
    months = {},
    years = {};

  seconds.val = Math.floor(milliseconds / 1000);
  minutes.val = Math.floor(seconds.val / 60);
  hours.val = Math.floor(minutes.val / 60);
  days.val = Math.floor(hours.val / 24);
  months.val = Math.floor(days.val / 30);
  years.val = Math.floor(days.val / 365);

  seconds.val %= 60;
  minutes.val %= 60;
  hours.val %= 24;
  days.val %= 30;
  months.val %= 12;

  seconds.name = "sec";
  minutes.name = "min";
  hours.name = "hr";
  days.name = "day";
  months.name = "month";
  years.name = "yr";

  var units = [years, months, days, hours, minutes, seconds];
  var toReturn = [];

  for (const unit of units) {
    if (unit.val === 1) toReturn.push(`${unit.val} ${unit.name}`);
    else if (unit.val > 1) toReturn.push(`${unit.val} ${unit.name}s`);
  }

  let str = toReturn.join(", ");
  return str;
}

module.exports = {
  name: "info",
  aliases: ["in", "inf", "information"],
  cat: "info",
  usage: "info [-yayfetch|-screenfetch]",
  desc: "Info about the bot and server",
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
    var CpuTemp = await si.cpuTemperature();
    var cpuTemp = CpuTemp.main;

    let Distro;
    let distro;
    if (isLinux())
      Distro = await exec('hostnamectl | grep -i "operating system"');
    if (!Distro) distro = "Error getting distro";
    else distro = Distro.stdout.trim().replace("Operating System: ", ``);

    let NodeV = await exec("node -v");
    let nodeV = NodeV.stdout.trim();

    let DjsV = require("../package.json").dependencies["discord.js"];
    let djsV = DjsV.replace("^", "");

    let infoEm = new Discord.MessageEmbed()
      .setTitle("Info")
      .addFields(
        { name: "Server Info", value: "Information about the server" },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
        {
          name: "Channels",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        { name: "Server ID", value: `${guild.id}`, inline: true },
        {
          name: "Server Owner",
          value: `${client.users.cache.get(msg.guild.ownerID)}`,
          inline: true,
        },
        { name: `Region`, value: `${guild.region}`, inline: true },
        { name: "Default Channel", value: `${defChannel}`, inline: true },
        { name: "Prefix", value: `${prefix}`, inline: true },
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
        { name: `CPU Temperature`, value: "`" + cpuTemp + "℃`", inline: true }
      )
      .setColor(config.embedColor);

    if (args[0] == "-yayfetch") {
      let YayFetch = await exec("yayfetch --hide-logo");
      let yayFetch = YayFetch.stdout.trim();
      infoEm.addFields({
        name: `Yayfetch`,
        value: "```yaml\n" + `${yayFetch}` + "```",
        inline: true,
      });

      channel.send({ embeds: [infoEm] });
    } else if (args[0] == "-screenfetch") {
      let ScreenFetch = await exec("screenfetch -N");
      let screenFetch = ScreenFetch.stdout.trim();
      infoEm.addFields({
        name: `Screenfetch`,
        value: "```yaml\n" + `${screenFetch}` + "```",
        inline: true,
      });

      channel.send({ embeds: [infoEm] });
    } else {
      channel.send({ embeds: [infoEm] });
    }
  },
};
