const akinator = require("discord.js-akinator");
module.exports = {
    name: "akinator",
    aliases: ["aki"],
    cat: "fun",
    usage: "akinator",
    desc: "Starts a game of Akinator",
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
        akinator(msg, client, "en");
    },
  };
  