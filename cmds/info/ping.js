const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the ping of the bot and databases"),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let botMem = interaction.guild.members.cache.get(client.user.id);
    let botNick = botMem ? botMem.displayName : client.user.username;

    let dbPingText = "Not connected";
    if (dbContext?.db) {
      const start = Date.now();
      try {
        await dbContext.db.command({ ping: 1 });
        dbPingText = `${Date.now() - start}ms`;
      } catch (err) {
        dbPingText = "Error";
      }
    }

    const pingEm = new EmbedBuilder()
      .setTitle(`Pong UwU!`)
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
        { name: `Database Ping`, value: `\`${dbPingText}\``, inline: true },
      )
      .setColor(config.embedColor);

    interaction.reply({ embeds: [pingEm] });
  },
};
