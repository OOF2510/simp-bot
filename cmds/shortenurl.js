var shortUrl = require("node-url-shortener");

function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

module.exports = {
  name: "shortenurl",
  aliases: ["urlshorten", "shorturl"],
  cat: "misc",
  usage: "shortenurl <url>",
  desc: "Shortens given url",
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
    if (!args[0]) return channel.send("You must provide a url");
    if (!isURL(args[0])) return channel.send("That is not a valid URL!");

    let url = args[0];

    shortUrl.short(url, function (err, url) {
      msg.reply(`<${url}>`);
    });
  },
};
