const math = require("discord-math");

module.exports = {
  name: "math",
  aliases: ["maths", "m", "calucate", "calculator"],
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
    try {
      let num1 = Number(args[0]);
      let operation = args[1];
      let num2 = Number(args[2]);

      if (!num1) return channel.send("Num1 needs to be specified!");
      if (!operation)
        return channel.send("An operation was not specified!");
      if (!num2) return channel.send("Num2 needs to be specified!");

      channel.send(`Answer: ${math.calculate(num1, operation, num2)}`);
    } catch (e) {
      console.log(e);
    }
  },
};
