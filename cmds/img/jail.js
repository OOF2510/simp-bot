const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("[IMG] puts specified user in jail")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to jail").setRequired(true)
    ),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await Canvacord.jail(av, true);
    let file = new AttachmentBuilder(image, {
      name: `${user.tag}-jail.png`,
    });

    msg.editReply({ files: [file] });
  },
};
