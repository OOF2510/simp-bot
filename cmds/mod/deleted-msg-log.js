const { SlashCommandBuilder, ChannelType } = require("discord.js");

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
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let status = interaction.options.getString("status");
    let channel = interaction.options.getChannel("channel");
    if (channel.type != ChannelType.GuildText) return msg.reply({content: 'Please provie a text channel', ephemeral: true })

    try {
      await db.query(
        `REPLACE INTO ${config.mysql.schema}.dellog (serverid, status, channelid) VALUES (${msg.guild.id}, ${status}, ${channel.id}) ;`
      );
      msg.reply(`Deleted message log: ${status} in ${channel}`);
    } catch (e) {
      msg.reply({ content: `Error!`, ephemeral: true });
    }
  },
};
