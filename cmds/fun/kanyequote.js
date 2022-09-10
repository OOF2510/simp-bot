const { SlashCommandBuilder } = require("discord.js");
const kanye = require("kanye.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanyequote")
    .setDescription("Gives a random quote by Ye (Kanye West)"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    let { quote } = await kanye();
    let quoteEm = new Discord.EmbedBuilder()
      .setTitle(`"${quote}"`)
      .setFooter({ text: `- Ye` })
      .setColor(config.embedColor);
    msg.reply({ embeds: [quoteEm] });
  },
};
