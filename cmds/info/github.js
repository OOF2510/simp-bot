const {
  SlashCommandBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Sends link to Simp Bot's Github page"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("GitHub")
        .setURL("https://github.com/OOF2510/simp-bot-rewritten")
    );

    msg.reply({
      content: "Click the button below to go to Simp Bot's Github repo!",
      components: [row],
    });
  },
};
