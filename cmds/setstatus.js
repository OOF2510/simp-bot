module.exports = {
  name: "setstatus",
  aliases: ["status"],
  cat: "dev",
  usage: "setstatus <type|reset> <name>",
  desc: "Sets the bot's status",
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
    if (!allowed.includes(msg.author.id))
      return channel.send(
        `Only the developer & certian whitelisted users can use that command!`
      );
    if (!args[0]) return msg.reply(`usage: ${this.usage}`);
    if (args[0].toLowerCase() === "reset") {
      await client.user.setActivity(
        `${client.guilds.cache.size} servers! | ${config.prefix}help`,
        {
          type: "WATCHING",
        }
      );
      return msg.reply("done");
    }
    if (
      !["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"].includes(
        args[0].toUpperCase()
      )
    )
      return msg.reply("please give a valid type");
    let type = args.shift().toUpperCase();
    await client.user.setActivity(`${args.join(" ")}`, { type: type });
    msg.reply("done");
  },
};
