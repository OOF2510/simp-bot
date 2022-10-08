const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

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
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, Discord, allowed) {
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

    await msg.deferReply();

    try {
      await db.query(
        `REPLACE INTO ${config.mysql.schema}.dellog (serverid, status, channelid) VALUES (${msg.guild.id}, ${status}, ${channel.id}) ;`
      );
      msg.editReply(`Deleted message log: ${status} in ${channel}`);
    } catch (e) {
      msg.editReply({ content: `Error!`, ephemeral: true });
    }
  },
};
