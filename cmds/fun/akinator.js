const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("akinator"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    msg.reply("re-working command, this is a placeholder");
  },
};
