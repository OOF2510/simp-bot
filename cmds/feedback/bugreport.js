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

    const repCh = client.channels.cache.get("817885616791355404");
    const repCh2 = client.channels.cache.get("817885785637257216");
    const repCh3 = client.channels.cache.get("825841694712004669");
    const rep = interaction.options.getString("bug");

    const repEm = new Discord.EmbedBuilder()
      .setTitle(`New bug report`)
      .addFields({ name: `Report:`, value: `${rep}` })
      .setFooter({
        text: `Reported by: ${msg.author.tag}`,
        iconUrl: `${msg.author.avatarURL()}`,
      })
      .setColor(config.embedColor)
      .setTimestamp();

    repCh.send({ embeds: [repEm] });
    repCh2.send({ embeds: [repEm] });
    repCh3.send({ embeds: [repEm] });

    msg.reply(
      `I have sent your bug report, queen! Join our server to see when it's responded to! https://discord.gg/zHtfa8GdPx`
    );
  },
};
