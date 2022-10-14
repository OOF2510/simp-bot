const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const Canvas = require("@napi-rs/canvas");
/**
 * Add image to image
 * @param {string|Buffer} image
 * @param {string} type
 * @returns {Promise<Buffer>}
 */
async function skel(image, type) {
  if (!image) throw new Error("image was not provided!");

  let spooky = await Canvas.loadImage(type);
  let img = await Canvas.loadImage(image);
  const canvas = Canvas.createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    spooky,
    (canvas.width / 2) - 50,
    canvas.height / 2,
    canvas.width,
    canvas.height
  );
  return canvas.encode("png");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-image")
    .setDescription("[IMG] puts the chosen image on a user's pfp")
    .addUserOption((option) =>
      option.setName("user").setDescription("who?").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("type").setDescription("Image you want to add").addChoices(
        {
          name: "skeleton",
          value:
            "https://cdn.discordapp.com/attachments/1021763955099717664/1027923627842207864/skeleton.png",
        },
        {
          name: "rover",
          value:
            "https://cdn.discordapp.com/attachments/1021763955099717664/1030522543121109104/rover.png",
        },
        {
          name: "timmy",
          value:
            "https://cdn.discordapp.com/attachments/1021763955099717664/1030523158387773461/timmy.png",
        },
        {
          name: "cow",
          value:
            "https://cdn.discordapp.com/attachments/1021763955099717664/1030523692725325945/pfp-transparent.png",
        }
      ).setRequired(true)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    let type = interaction.options.getString('type')
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await skel(av, type);
    let file = new AttachmentBuilder(image, {
      name: `${user.tag}-addimg.png`,
    });

    msg.editReply({ files: [file] });
  },
};
