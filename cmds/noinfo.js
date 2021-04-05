module.exports = {
  name: "noinfo",
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
    niDB,
    bchDB,
    blDB
  ) {
    if (!msg.member.permissions.has("MANAGE_GUILD"))
      return channel.send("You dont have permission to do that!");
    let noInfo = await niDB.get(guild.id);
    if (noInfo) return channel.send("You have already opted out of info!");
    let addCh = client.channels.cache.get("821862422952411146");
    await niDB.set(guild.id, "true");
    addCh.messages
      .fetch()
      .then((messages) =>
        messages.filter((m) =>
          m.embeds.forEach((embed) => {
            if (!embed.description.includes(guild.id)) return;
            m.delete();
          })
        )
      )
      .catch(console.error);
    channel.send("Done!");
    addCh.send("Server requested info deletion!");
  },
};
