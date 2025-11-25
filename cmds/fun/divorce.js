const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("End your current marriage"),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").Collection}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let msg = interaction;
    let author = msg.author;
    let serverId = msg.guild.id;

    await msg.deferReply();

    const collections = dbContext?.collections;

    if (!collections?.marriages) {
      return msg.editReply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    let married = await collections.marriages.findOne({
      serverId: String(serverId),
      $or: [{ userId: author.id }, { spouseId: author.id }],
    });
    if (!married)
      return msg.editReply(
        `You're not married! You can't end a marriage that doesn't exist!`
      );

    await collections.marriages.deleteOne({ _id: married._id });
    msg.editReply("You are now successfully divorced!");
  },
};
