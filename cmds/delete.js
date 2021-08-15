const disImg = require("discord-image-generation");

module.exports = {
  name: "delete",
  aliases: ["del"],
  cat: "fun",
  usage: "delete [user mention]",
  desc: "Deletes specified user",
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
    let img = await new disImg.Delete().getImage(avatar);
    let attach = new Discord.MessageAttachment(img, "delete.png");
    msg.channel.send({ files: [attach] });
  },
};
