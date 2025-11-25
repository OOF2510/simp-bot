const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Sends a suggestion")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("Your suggestion for simp bot")
        .setRequired(true),
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
    let msg = interaction;
    const sug = interaction.options.getString("suggestion");

    const sugEm = new EmbedBuilder()
      .setTitle(`New suggestion`)
      .addFields({ name: `Suggestion:`, value: `${sug}` })
      .setFooter({
        text: `Suggested by: ${msg.author.tag}`,
        iconURL: `${msg.author.displayAvatarURL()}`,
      })
      .setColor(config.embedColor)
      .setTimestamp();

    const sugChannels = Array.isArray(config.feedbackChannels?.suggestions)
      ? config.feedbackChannels.suggestions
      : [];
    sugChannels.forEach((chid) => {
      let ch = client.channels.cache.get(chid);
      if (ch) ch.send({ embeds: [sugEm] });
    });

    msg.reply(
      `I have sent your suggestion, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`,
    );
  },
};
