const disImg = require("discord-image-generation");

module.exports = {
  name: "rip",
  aliases: ["funeral"],
  cat: "img",
  usage: "rip [user mention]",
  desc: "Makes a funeral for the specified user",
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
    let user = msg.mentions.users.first();
    if (!user) user = author;
    let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
    let img = await new disImg.Rip().getImage(avatar);
    let attach = new Discord.MessageAttachment(img, "rip.png");
    msg.channel.send({ files: [attach] });
  },
};
