const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const { Canvacord } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("[IMG] delete specified user")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to delete").setRequired(true)
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

    let image = await Canvacord.delete(av, true);
    let file = new AttachmentBuilder(image, {
      name: `${user.tag}-deleted.png`,
    });

    msg.editReply({ files: [file] });
  },
};
