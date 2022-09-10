const { ping } = require("@oof2510/ping");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the ping of the bot and databases"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let botMem = interaction.guild.members.cache.get(client.user.id);
    let botNick = botMem ? botMem.displayName : client.user.username;

    // var dbPing = await ping(config.mysql.ip);

    const pingEm = new Discord.EmbedBuilder()
      .setTitle(`Pong UwU!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true } //,
        // {
        //   name: `Database Ping`,
        //   value: `\`${Math.round(dbPing)}ms\``,
        //   inline: true,
        // }
      )
      .setColor(config.embedColor);

    interaction.reply({ embeds: [pingEm] });
  },
};
