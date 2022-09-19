const { SlashCommandBuilder } = require("discord.js");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("[IMG] gay-ifys specified user's pfp")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to turn gay")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");
    await msg.deferReply();

    let av = user.displayAvatarURL();

    let image = await Canvacord.rainbow(av);
    let file = new Discord.AttachmentBuilder(image, {
      name: `${user.tag}-gay.png`,
    });

    msg.editReply({ files: [file] });
  },
};
