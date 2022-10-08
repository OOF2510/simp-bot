const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flirt")
    .setDescription("Sends a random pick-up line")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to direct pick up line at")
        .setRequired(false)
    ),
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
    let recipient = interaction.options.getUser("user");
    
    await msg.deferReply();

    try {
      let { data } = await axios.get(
        "https://getpickuplines.herokuapp.com/lines/random"
      );
      let { line } = data;
      
      return msg.editReply(`${recipient ? recipient : ""} ${line}`);
    } catch (e) {
      return msg.editReply({ content: "Error!", ephemeral: true });
    }
  },
};
