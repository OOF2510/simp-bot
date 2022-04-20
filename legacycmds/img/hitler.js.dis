const disImg = require("discord-image-generation");

module.exports = {
  name: "hitler",
  aliases: ["h*tler"],
  cat: "img",
  usage: "hitler [user mention]",
  desc: "Makes specified user worse than hitler",
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
    let img = await new disImg.Hitler().getImage(avatar);
    let attach = new Discord.MessageAttachment(img, "hitler.png");
    msg.channel.send({ files: [attach] });
  },
};
