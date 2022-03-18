const { SlashCommandBuilder } = require("@discordjs/builders");

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
  async execute(interaction, client, config, db, Discord, allowed) {
    let user = interaction.options.getUser("user") || interaction.author;
    let mem = interaction.guild.members.cache.get(user.id);

    let userNick = mem ? mem.displayName : user.username;

    let av = user.avatarURL({ dynamic: true, size: 512 });

    let avEm = new Discord.MessageEmbed()
      .setTitle(`${userNick}'s Avatar`)
      .setImage(av)
      .setColor(config.embedColor)
      .setTimestamp();

    await interaction.reply({ embeds: [avEm] });
  },
};
