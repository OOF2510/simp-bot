const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Join the support server!"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    let supEm = new Discord.MessageEmbed()
      .setTitle(`Join Simp Bot Support!`)
      .setURL("https://discord.gg/zHtfa8GdPx")
      .setTimestamp();

    msg.reply({ embeds: [supEm] });
  },
};
