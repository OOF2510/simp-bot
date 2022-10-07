const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const kanye = require("kanye.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanyequote")
    .setDescription("Gives a random quote by Ye (Kanye West)"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    let { quote } = await kanye();
    let quoteEm = new EmbedBuilder()
      .setTitle(`"${quote}"`)
      .setFooter({ text: `- Ye` })
      .setColor(config.embedColor);
    msg.reply({ embeds: [quoteEm] });
  },
};
