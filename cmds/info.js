const osinfo = require("@oof2510/osinfo")

module.exports = {
  name: "info",
  aliases: ["in", "inf", "information", "stats"],
  cat: "info",
  usage: "info [-yayfetch] [-screenfetch]",
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
        { name: "Channels", value: guild.channels.cache.size, inline: true },
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
        { name: "Platform", value: "`" + osinfo.os.platform + "`", inline: true },
        { name: "Arch", value: "`" + osinfo.os.arch + "`", inline: true },
        { name: "Release", value: "`" + osinfo.os.release + "`", inline: true },
        { name: "Version", value: "`" + osinfo.os.version + "`", inline: true },
        { name: "Linux Distro", value: "`" + osinfo.os.linuxDistro + "`", inline: true },
        { name: "Bot RAM Usage", value: "`" + osinfo.process.memUsage + "`", inline: true },
        {
          name: "System RAM Usage",
          value: "`" + osinfo.system.memUsage + "`",
          inline: true,
        },
        { name: `NodeJS Version`, value: "`" + osinfo.nodejsVersion + "`", inline: true },
        { name: `Discord.js Version`, value: "`" + djsV + "`", inline: true },
        { name: `System Uptime`, value: "`" + osinfo.system.uptime + "`", inline: true },
        { name: `Bot Uptime`, value: "`" + osinfo.process.uptime + "`", inline: true },
        { name: `CPU Temperature`, value: "`" + osinfo.system.cpuTemp + "℃`", inline: true }
      )
      .setColor(config.embedColor);

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
