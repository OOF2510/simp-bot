const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Sends a suggestion")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("Your suggestion for simp bot")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    const sugCh = client.channels.cache.get("816823026384633887");
    const sugCh2 = client.channels.cache.get("816828453110022166");
    const sugCh3 = client.channels.cache.get("825840766769299527");
    const sug = interaction.options.getString("suggestion");

    const sugEm = new Discord.EmbedBuilder()
      .setTitle(`New suggestion`)
      .addFields({ name: `Suggestion:`, value: `${sug}` })
      .setFooter(`Suggested by: ${msg.author.tag}`, msg.author.avatarURL())
      .setColor(config.embedColor)
      .setTimestamp();

    sugCh.send({ embeds: [sugEm] });
    sugCh2.send({ embeds: [sugEm] });
    sugCh3.send({ embeds: [sugEm] });

    msg.reply(`I have sent your suggestion, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`);
  },
};
