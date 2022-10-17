const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const { ContextMenuCommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const marry = require("../cmds/fun/marry").marry;

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Marry User")
    .setType(ApplicationCommandType.User),
  /**
   * Executes the command
   * @param {ContextMenuCommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let user = interaction.targetUser;

    try {
      await marry(user, db, config, interaction);
    } catch (e) {
      return;
    }
  },
};
