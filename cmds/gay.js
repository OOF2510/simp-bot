const disImg = require("discord-image-generation");

module.exports = {
  name: "gay",
  aliases: ["homo", "homosexual"],
  cat: "fun",
  usage: "gay [user mention]",
  desc: "Gay-ifys specified user's pfp",
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
    blDB,
    wcDB,
    djDB
  ) {
    let user = msg.mentions.users.first();
    if (!user) user = author;
    let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
    let img = await new disImg.Gay().getImage(avatar);
    let attach = new Discord.MessageAttachment(img, "delete.png");
    msg.channel.send({ files: [attach] });
  },
};
