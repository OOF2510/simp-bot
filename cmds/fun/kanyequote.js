const kanye = require("kanye.js");

module.exports = {
  name: "kanye-quote",
  aliases: ["kq", "kanye", "kanyequote"],
  cat: "fun",
  usage: "kanye-quote",
  desc: "Gives a random quote by Kanye West",
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
    let { quote } = await kanye();
    let quoteEm = new Discord.MessageEmbed()
      .setTitle(`"${quote}"`)
      .setFooter(`- Kanye West`);
    msg.reply({ embeds: [quoteEm] });
  },
};
