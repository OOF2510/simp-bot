const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Join the support server!"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    let supEm = new EmbedBuilder()
      .setTitle(`Join Simp Bot Support!`)
      .setURL("https://discord.gg/zHtfa8GdPx")
      .setTimestamp();

    msg.reply({ embeds: [supEm] });
  },
};
