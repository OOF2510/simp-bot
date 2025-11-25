const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bugreport")
    .setDescription("Sends a bug report")
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("Description of the bug")
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
    const rep = interaction.options.getString("bug");

    const repEm = new EmbedBuilder()
      .setTitle(`New bug report`)
      .addFields({ name: `Report:`, value: `${rep}` })
      .setFooter({
        text: `Reported by: ${msg.author.tag}`,
        iconURL: `${msg.author.displayAvatarURL()}`,
      })
      .setColor(config.embedColor)
      .setTimestamp();

    const bugChannels = Array.isArray(config.feedbackChannels?.bugs)
      ? config.feedbackChannels.bugs
      : [];
    bugChannels.forEach((chid) => {
      let ch = client.channels.cache.get(chid);
      if (ch) ch.send({ embeds: [repEm] });
    });

    msg.reply(
      `I have sent your bug report, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`,
    );
  },
};
