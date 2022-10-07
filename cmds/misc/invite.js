const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Sends the bot's invite link"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let invEm = new EmbedBuilder()
      .setTitle(`Invite me to your server!`)
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&scope=bot%20applications.commands`
      )
      .setColor(config.embedColor)
      .setTimestamp();
    msg.reply({ embeds: [invEm] });
  },
};
