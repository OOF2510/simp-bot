const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("generate an insult")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to insult").setRequired(false)
    ),
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
    let user = interaction.options.getUser("user");

    try {
      let response = await axios.get(
        "https://evilinsult.com/generate_insult.php?lang=en&type=text"
      );
      let insult = response.data;

      if (user) {
        msg.reply(`${user} ${insult}`);
      } else {
        msg.reply(`${insult}`);
      }
    } catch (e) {
      try {
        await msg.reply({ content: "Error!", ephemeral: true });
      } catch (e) {
        return;
      }
    }
  },
};
