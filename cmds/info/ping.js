const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the ping of the bot and databases"),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let botMem = interaction.guild.members.cache.get(client.user.id);
    let botNick = botMem ? botMem.displayName : client.user.username;

    // var dbPing = await ping(config.mysql.ip);

    const pingEm = new EmbedBuilder()
      .setTitle(`Pong UwU!`)
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
