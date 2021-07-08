module.exports = {
  name: "purge",
  aliases: ["clear", "delete", "prune"],
  cat: "moderation",
  usage: "purge <number of messages to delete>",
  desc: "Deletes specified number of messages",
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
    if (!msg.member.permissions.has("MANAGE_MESSAGES"))
      return msg.channel.send("You dont have permissions to do that!");
    if (!args[0])
      return msg.channel.send(
        `Usage: ${prefix}purge <number of messages to purge>`
      );
    var Num = args[0];
    var nUm = Number(Num);
    var num = nUm + 1;
    if (isNaN(num)) return msg.channel.send("Please provide a valid number!");
    if (num > 1000)
      return msg.channel.send(
        "Cannot delete more than 999 messages at a time!"
      );
    channel.bulkDelete(num).then((msgs) => {
      var amount = msgs.size - 1;
      channel.send(`Deleted ${amount} messages!`);
    });
  },
};
