const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flirt")
    .setDescription("Sends a random pick-up line")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to direct pick up line at")
        .setRequired(false),
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
    let recipient = interaction.options.getUser("user");

    await msg.deferReply();

    try {
      const res = await axios.get("https://rizzapi.vercel.app/random");
      let line = res.data?.text || "You're cute, let's get waffles.";

      if (recipient) {
        line = `${recipient}, ${line}`;
      }

      return msg.editReply(line);
    } catch (e) {
      console.error("[flirt] fetch failed:", e?.message || e);
      return msg.editReply({
        content: "I couldn't fetch a pickup line right now. Try again later.",
        ephemeral: true,
      });
    }
  },
};
