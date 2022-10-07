const { SlashCommandBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas')
async function skel(image) {
  if (!image) throw new Error("image was not provided!");

  let spooky = await Canvas.loadImage('https://cdn.discordapp.com/attachments/1021763955099717664/1027923627842207864/skeleton.png');
  let img = await Canvas.loadImage(image);
  const canvas = Canvas.createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spooky, canvas.width/2, canvas.height/2, canvas.width, canvas.height);
  return canvas.encode("png");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skeleton")
    .setDescription("[IMG] puts a spooky scary skeleton on a user's pfp")
    .addUserOption((option) =>
      option.setName("user").setDescription("who?").setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await skel(av);
    let file = new Discord.AttachmentBuilder(image, {
      name: `${user.tag}-skeleton.png`,
    });

    msg.editReply({ files: [file] });
  },
};