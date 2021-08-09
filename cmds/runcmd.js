module.exports = {
  name: "runcmd",
  cat: "dev",
  usage: "runcmd <terminal command>",
  desc: "Runs the specified command and return the output",
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
      try {
        const Out = await exec(`${cmd}`);
        const out = Out.stdout.trim();

        let response = "```bash\n" + `${out}` + "```";

        if (response.length > 2000)
          response = `Error: Message too long (${response.length}/2000)`;

        channel.send(response);
      } catch {
        channel.send(`Error executing`);
      }
    }
  },
};
