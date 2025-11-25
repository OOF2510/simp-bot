const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deleted-message-log")
    .setDescription("Enable or disable logging deleted messages into a channel")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Enable or Disable?")
        .addChoices(
          { name: "Enable", value: "TRUE" },
          { name: "Disable", value: "FALSE" }
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Logging channel")
        .setRequired(true)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").Collection}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, Discord, allowed) {
    let msg = interaction;
    let status = interaction.options.getString("status");
    let channel = interaction.options.getChannel("channel");
    if (channel.type != ChannelType.GuildText)
      return msg.reply({
        content: "Please provie a text channel",
        ephemeral: true,
      });
    let bot = msg.guild.members.cache.get(client.user.id);
    if (
      !bot.permissionsIn(channel).has(PermissionFlagsBits.ViewChannel) ||
      !bot.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)
    )
      return msg.reply({
        content: "I do not have proper permissions in that channel",
        ephemeral: true,
      });

    const collections = dbContext?.collections;
    if (!collections?.dellog) {
      return msg.reply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    await msg.deferReply();

    try {
      await collections.dellog.updateOne(
        { serverId: String(msg.guild.id) },
        {
          $set: {
            serverId: String(msg.guild.id),
            status: status === "TRUE",
            channelId: channel.id,
          },
        },
        { upsert: true }
      );
      msg.editReply(
        `Deleted message log: ${status === "TRUE" ? "Enabled" : "Disabled"} in ${channel}`
      );
    } catch (e) {
      msg.editReply({ content: `Error!`, ephemeral: true });
    }
  },
};
