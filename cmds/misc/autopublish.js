const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autopublish")
    .setDescription(
      "auto-publish (crosspost) your messages in announcement channels",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("enable or disable")
        .setRequired(true)
        .setChoices(
          { name: "Enable", value: "TRUE" },
          { name: "Disable", value: "FALSE" },
        ),
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").MongoCollections}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let msg = interaction;
    let status = interaction.options.getString("status");
    const collections = dbContext?.collections;

    if (!collections?.autopub) {
      return msg.reply({
        content: "Database not ready. Please try again in a moment.",
        ephemeral: true,
      });
    }

    try {
      await collections.autopub.updateOne(
        { serverId: String(msg.guild.id) },
        { $set: { serverId: String(msg.guild.id), status: status === "TRUE" } },
        { upsert: true },
      );
      msg.reply(`AutoPublish: ${status === "TRUE" ? "Enabled" : "Disabled"}`);
    } catch (e) {
      msg.reply({ content: `Error!`, ephemeral: true });
    }
  },
};
