module.exports = {
  name: "welcome",
  aliases: ["wel", "welcome-message"],
  cat: "moderation",
  usage: "welcome <enable|disable|channel> [channel mention]",
  desc: "Sends a welcome message in specified channel when a user joins the server [WAITING ON WHITELISTING]",
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
    blDB,
    wcDB
  ) {
    if (!msg.member.permissions.has("MANAGE_MESSAGES"))
      return msg.reply("You dont have permissions to do that!");
    if (!args[0]) return msg.reply(`Usage: \`${prefix}${this.usage}\``);
    if (args[0].toLowerCase() == "enable") {
      let c = msg.mentions.channels.first();
      if (!c) c = msg.channel;

      let isEnabled = await wcDB.get(guild.id);
      if (isEnabled)
        return msg.reply(
          `Welcome messages are already enabled! (In <#${isEnabled}>)`
        );

      await wcDB.set(guild.id, c.id);
      channel.send(`Enabled welcome messages in <#${c.id}>`);
    } else if (args[0].toLowerCase() == "disable") {
      let isEnabled = await wcDB.get(guild.id);
      if (!isEnabled)
        return msg.reply(`Welcome messages aren't enabled in this server!`);

      await wcDB.delete(guild.id);
      channel.send(`Disabled welcome messages for the server`);
    } else if (args[0] == `channel`) {
      let c = msg.mentions.channels.first();
      if (!c) c = msg.channel;

      let isEnabled = await wcDB.get(guild.id);
      if (!isEnabled)
        return msg.reply(`Welcome messages aren't enabled in this server!`);

      await wcDB.set(guild.id, c.id);
      channel.send(`Changed welcome message channel to <#${c.id}>`);
    }
  },
};
