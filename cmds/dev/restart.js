module.exports = {
  name: "restart",
  cat: "dev",
  usage: "restart",
  desc: "Restarts the bot",
  execute(
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
    if (allowed.includes(author.id)) {
      msg.reply(`Restarting UwU!`);
      client.destroy();
      client.login(config.token);
      client.user.setActivity(`${client.guilds.cache.size} servers! | s!help`, {
        type: "WATCHING",
      });
      console.log(`Restarted because ${msg.author.username} told me to!`);
      setTimeout(() => {
        msg.channel.send(`Successfully restarted!`);
      }, 2000);
    } else {
      msg.reply(`Only the developer & certian whitelisted users can do that!`);
    }
  },
};
