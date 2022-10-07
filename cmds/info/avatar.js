const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets a user's avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to get avatar of")
        .setRequired(false)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let user = interaction.options.getUser("user") || interaction.author;
    let mem = interaction.guild.members.cache.get(user.id);

    let userNick = mem ? mem.displayName : user.username;

    let av = user.displayAvatarURL({ size: 512 });

    let avEm = new EmbedBuilder()
      .setTitle(`${userNick}'s Avatar`)
      .setImage(av)
      .setColor(config.embedColor)
      .setTimestamp();

    await interaction.reply({ embeds: [avEm] });
  },
};
