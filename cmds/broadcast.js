var Long = require("long");

const getDefaultChannel = (guild) => {
  const generalChannel = guild.channels.cache.find(
    (channel) => channel.name === "general"
  );
  if (generalChannel) return generalChannel;

  if (guild.channels.cache.has(guild.id))
    return guild.channels.cache.get(guild.id);

  return guild.channels.cache
    .filter(
      (c) =>
        c.type === "text" &&
        c.permissionsFor(guild.client.user).has("SEND_MESSAGES")
    )
    .sort(
      (a, b) =>
        a.position - b.position ||
        Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()
    )
    .first();
};

module.exports = {
  name: "broadcast",
  aliases: ['br', 'broad', 'brc'],
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
    preDB,
    nbDB,
    niDB,
    bchDB,
    blDB
  ) {
    if (allowed.includes(author.id)) {
      let message = msg.content.replace(`${prefix}broadcast`, ``);

      if (!message) return msg.channel.send(`Can't send an empty message!`);

      let broadcastEm = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`A message from my team:`)
        .setDescription(message)
        .setFooter(author.username, author.avatarURL({ dynamic: true }))
        .setTimestamp();

      client.guilds.cache.forEach(async (guild) => {
        let disabled = await nbDB.get(guild.id);
        if (disabled) return;
        let defC;
        let hasBrCh = await bchDB.get(guild.id);

        if (hasBrCh) defC = client.channels.cache.get(hasBrCh);
        else defC = getDefaultChannel(guild);

        defC.send(broadcastEm);
      });

      channel.send("Broadcast sent!");
    } else {
      channel.send(
        `Only the developer & certian whitelisted users can use that command!`
      );
    }
  },
};
