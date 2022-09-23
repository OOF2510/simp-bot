const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("tells a joke"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;

    try {
      let response = await axios.get("https://v2.jokeapi.dev/joke/Any");
      let joke = response.data;

      if (joke.setup && joke.delivery) {
        msg.reply(`${joke.setup}\n||${joke.delivery}||`);
      } else if (joke.joke) {
        msg.reply(`${joke.joke}`);
      } else {
        msg.reply({ content: "Error!", ephemeral: true });
      }
    } catch (e) {
      msg.reply({ content: "Error!", ephemeral: true });
    }
  },
};
