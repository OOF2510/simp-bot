const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Craiyon = require("craiyon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("craiyon")
    .setDescription(
      "Uses Craiyon to grenerate an image based on a prompt. This can take up to 3 mins to run."
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("prompt to base image off of")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let prompt = interaction.options.getString("prompt");

    await msg.deferReply();

    const craiyon = new Craiyon.Client();

    let result = await craiyon.generate({ prompt: `${prompt}` });
    let buffer = result.images[0].asBuffer();

    let attachment = new AttachmentBuilder(buffer, { name: `${prompt}.jpg` });

    msg.editReply({ files: [attachment] });
  },
};
