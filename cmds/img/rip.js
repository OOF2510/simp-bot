const { SlashCommandBuilder } = require("discord.js");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rip")
    .setDescription("[IMG] gravestone of specified user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to make gravestone for")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await Canvacord.rip(av);
    let file = new Discord.AttachmentBuilder(image, {
      name: `${user.tag}-rip.png`,
    });

    msg.editReply({ files: [file] });
  },
};
