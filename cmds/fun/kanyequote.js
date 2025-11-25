const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanyequote")
    .setDescription("Gives a random quote by Ye (Kanye West)"),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    try {
      const { data } = await axios.get("https://api.kanye.rest/");
      const quote = data?.quote || "I feel like Pablo.";
      let quoteEm = new EmbedBuilder()
        .setTitle(`"${quote}"`)
        .setFooter({ text: `- Ye` })
        .setColor(config.embedColor);
      msg.reply({ embeds: [quoteEm] });
    } catch (error) {
      msg.reply("Couldn't reach Kanye right now. Try again later.");
    }
  },
};
