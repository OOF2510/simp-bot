module.exports = {
  name: "runcmd",
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
    if (!allowed.includes(author.id)) {
      channel.send(
        `Only the developer & certian whitelisted users can use that command!`
      );
    } else {
      let cmd = args.join(" ");
      const Out = await exec(`${cmd}`);
      const out = Out.stdout.trim();

      channel.send(
        "```bash" +
          `
        ${out}` +
          "```"
      );
    }
  },
};
