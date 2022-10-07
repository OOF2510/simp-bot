const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("[IMG] puts specified user in jail")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to jail").setRequired(true)
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

    let image = await Canvacord.jail(av, true);
    let file = new AttachmentBuilder(image, {
      name: `${user.tag}-jail.png`,
    });

    msg.editReply({ files: [file] });
  },
};
