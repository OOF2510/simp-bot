const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("[DEV] Announce to all servers")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The announcement message to send")
        .setRequired(true)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    // Check if user is allowed
    if (!allowed.includes(interaction.user.id)) {
      return interaction.reply({
        content: `Only the developer & certain whitelisted users can use that command!`,
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const announcementMessage = interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setTitle("Announcement from the Bot Developer")
      .setDescription(announcementMessage)
      .setColor(config.embedColor)
      .setTimestamp();

    let successCount = 0;
    let failCount = 0;

    // Send to all guilds
    for (const guild of client.guilds.cache.values()) {
      try {
        // Try system channel first
        if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SendMessages')) {
          await guild.systemChannel.send({ embeds: [embed] });
          successCount++;
        } 
        // Fall back to first available text channel
        else {
          const channel = guild.channels.cache.find(
            ch => ch.isTextBased() && 
            ch.permissionsFor(client.user).has('SendMessages')
          );
          if (channel) {
            await channel.send({ embeds: [embed] });
            successCount++;
          } else {
            failCount++;
          }
        }
      } catch (error) {
        failCount++;
        console.error(`Failed to send announcement to ${guild.name}:`, error.message);
      }
    }

    await interaction.editReply(
      `Announcement sent to ${successCount} server(s). Failed: ${failCount}`
    );
  },
};