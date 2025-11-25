const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const { ContextMenuCommandInteraction, Client } = require("discord.js");
const marryCommand = require("../cmds/fun/marry");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Marry User")
    .setType(ApplicationCommandType.User),
  /**
   * Executes the command
   * @param {ContextMenuCommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").Collection}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    return marryCommand.execute(interaction, client, config, dbContext, allowed);
  },
};
