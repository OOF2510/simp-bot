module.exports = {
  name: "kick",
  aliases: ["k", "ki", "kck"],
  cat: "moderation",
  usage: "kick <user mention|user id|username|nickname> [reason]",
  desc: "Kicks specified member from the server",
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
    wcDB,
    djDB
  ) {
    if (!msg.member.permissions.has("KICK_MEMBERS"))
      return msg.reply(
        "You must have the `KICK_MEMBERS` permission to do that"
      );
    if (!msg.guild.me.permissions.has("KICK_MEMBERS"))
      return msg.reply("I must have the `KICK_MEMBERS` permission to do that");
    if (!args[0]) return msg.reply("Please specify a member to kick!");

    let member =
      msg.mentions.members.first() ||
      msg.guild.members.cache.get(args[0]) ||
      msg.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      msg.guild.members.cache.find(
        (ro) => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()
      );
    if (!member) return msg.reply("That user is not in this server!");
    if (member.id === msg.guild.me.id)
      return msg.reply("I cannot kick myself!");
    if (member.id === author.id) return msg.reply("You can't kick yourself!");
    if (!member.kickable)
      return msg.channel.send(
        "I cannot kick this member, make sure my highest role is above their highest role!"
      );

    let Reason = args.slice(1).join(" "),
      reason = Reason
        ? Reason + ` (Performed by ${author.tag})`
        : `Performed by ${author.tag}`;

    await member.kick(reason);
    msg.reply(`✅ Successfully kicked **${member.user.tag}**`);
  },
};
