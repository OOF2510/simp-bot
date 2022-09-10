const { SlashCommandBuilder } = require("discord.js");
const kanye = require("kanye.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanyequote")
    .setDescription("Gives a random quote by Kanye West"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    let { quote } = await kanye();
    let quoteEm = new Discord.EmbedBuilder()
      .setTitle(`"${quote}"`)
      .setFooter({ text: `- Kanye West` })
      .setColor(config.embedColor);
    msg.reply({ embeds: [quoteEm] });
  },
};
