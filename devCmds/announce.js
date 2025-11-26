const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("[DEV] Announce to all servers")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The announcement message to send")
        .setRequired(true)
    )
    ,
    /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction
    let announcementMessage = interaction.options.getString("message");
    if (!allowed.includes(msg.author.id)) return msg.reply(`Only the developer & certian whitelisted users can use that command!`, { ephemeral: true });
    await msg.deferReply();
    let embed = new EmbedBuilder()
      .setTitle("Announcement from the Bot Developer")
      .setDescription(announcementMessage)
      .setColor(config.embedColor)
      .setTimestamp();

    client.guilds.cache.forEach(guild => {
      guild.systemChannel.send({ embeds: [embed] }).catch(() => {});
    });

    await msg.reply(`Announcement sent!`);
  },
};
