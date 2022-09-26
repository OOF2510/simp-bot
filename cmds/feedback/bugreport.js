const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bugreport")
    .setDescription("Sends a bug report")
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("Description of the bug")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    const rep = interaction.options.getString("bug");

    const repEm = new Discord.EmbedBuilder()
      .setTitle(`New bug report`)
      .addFields({ name: `Report:`, value: `${rep}` })
      .setFooter({
        text: `Reported by: ${msg.author.tag}`,
        iconUrl: `${msg.author.displayAvatarURL()}`,
      })
      .setColor(config.embedColor)
      .setTimestamp();

    config.feedbackChannels.bugs.forEach((chid) => {
      let ch = client.channels.cache.get(chid);
      ch.send({ embeds: [repEm] });
    });

    msg.reply(
      `I have sent your bug report, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`
    );
  },
};
