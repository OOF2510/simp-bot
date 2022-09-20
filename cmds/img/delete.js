const { SlashCommandBuilder } = require("discord.js");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("[IMG] delete specified user")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to delete").setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await Canvacord.delete(av, true);
    let file = new Discord.AttachmentBuilder(image, {
      name: `${user.tag}-deleted.png`,
    });

    msg.editReply({ files: [file] });
  },
};
