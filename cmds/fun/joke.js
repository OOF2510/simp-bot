const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
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
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
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
