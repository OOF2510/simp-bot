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
    const sug = interaction.options.getString("suggestion");

    const sugEm = new Discord.EmbedBuilder()
      .setTitle(`New suggestion`)
      .addFields({ name: `Suggestion:`, value: `${sug}` })
      .setFooter({
        text: `Suggested by: ${msg.author.tag}`,
        iconURL: `${msg.author.displayAvatarURL()}`,
      })
      .setColor(config.embedColor)
      .setTimestamp();

      config.feedbackChannels.suggestions.forEach((chid) => {
        let ch = client.channels.cache.get(chid)
        ch.send({ embeds: [sugEm] })
      })

    msg.reply(
      `I have sent your suggestion, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`
    );
  },
};
