const si = require("systeminformation");
const formatBytes = require("../../util/formatBytes");
const millisecondsToStr = require("../../util/convertMilsec");
const isLinux = require("../../util/isLinux");

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
    db
  ) {
    var uptimeMilsec = os.uptime() * 1000,
      uptime = millisecondsToStr(uptimeMilsec),
      botUptimeMilsec = process.uptime() * 1000,
      botUptime = millisecondsToStr(botUptimeMilsec),
      memUsageB = process.memoryUsage().heapUsed,
      memUsage = formatBytes(memUsageB),
      totalSysMem = os.totalmem(),
      freeSysMem = os.freemem(),
      usedSysMem = totalSysMem - freeSysMem,
      sysMemUsage = formatBytes(usedSysMem),
      CpuTemp = await si.cpuTemperature(),
      cpuTemp = CpuTemp.main;

    let Distro, distro;
    if (isLinux())
      Distro = await exec('hostnamectl | grep -i "operating system"');
    if (!Distro) distro = "Error getting distro";
    else distro = Distro.stdout.trim().replace("Operating System: ", ``);

    let NodeV = await exec("node -v"),
      nodeV = NodeV.stdout.trim();

    let DjsV = require("../package.json").dependencies["discord.js"],
      djsV = DjsV.replace("^", "v");

    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
      ServerCreated = guild.createdAt,
      serverCreated = ServerCreated.toLocaleDateString("en-US", options),
      today = new Date();
    (ServerAge = today.getTime() - ServerCreated.getTime()),
      (serverAge = millisecondsToStr(ServerAge));

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
        {
          name: "Emojis",
          value: `${guild.emojis.cache.size}`,
          inline: true,
        },
        {
          name: "Stickers",
          value: `${guild.stickers.cache.size}`,
          inline: true,
        },
        { name: "Server ID", value: `${guild.id}`, inline: true },
        {
          name: "Server Owner",
          value: `${client.users.cache.get(guild.ownerId)}`,
          inline: true,
        },
        {
          name: `Server Created`,
          value: `${serverCreated} (${serverAge} ago)`,
          inline: true,
        },
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
      .setThumbnail(guild.iconURL({ dynamic: true }))
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
