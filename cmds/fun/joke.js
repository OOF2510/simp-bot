const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("tells a joke"),
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
      let response = await axios.get(
        "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas",
      );
      let joke = response.data;

      if (joke.setup && joke.delivery) {
        await msg.reply(`${joke.setup}\n||${joke.delivery}||`);
      } else if (joke.joke) {
        await msg.reply(`${joke.joke}`);
      } else {
        console.warn("[joke] Unexpected payload", joke);
        await msg.reply({
          content: "Couldn't fetch a joke right now. Try again later.",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error("[joke] fetch failed:", e?.message || e);
      await msg
        .reply({
          content: "Failed to fetch a joke. Please try again later.",
          ephemeral: true,
        })
        .catch(() => {});
    }
  },
};
