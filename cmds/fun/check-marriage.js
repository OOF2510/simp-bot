const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-marriage")
    .setDescription("Check your current marriage"),
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
    if (!married) return msg.editReply(`You're not married!`);

    let user = msg.guild.members.cache.get(married.userId);
    let spouse = msg.guild.members.cache.get(married.spouseId);
    if (!user || !spouse) {
      return msg.editReply(
        `It seems that the user you were married to is no longer in this server, you might wanna divorce...`,
      );
    }
    if (user.id === author.id)
      return msg.editReply(`You are married to ${spouse}`);
    else return msg.editReply(`You are married to ${user}`);
  },
};
