const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
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
    await msg.deferReply();

    let av = user.displayAvatarURL({ size: 512 });

    let image = await Canvacord.rainbow(av);
    let file = new AttachmentBuilder(image, {
      name: `${user.tag}-gay.png`,
    });

    msg.editReply({ files: [file] });
  },
};
