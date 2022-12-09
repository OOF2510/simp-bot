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
      let res = await axios.get("https://api.jcwyt.com/pickup");
      let { data } = res;

      return msg.editReply(`${recipient ? recipient : ""} ${data}`);
    } catch (e) {
      return msg.editReply({ content: `Error!`, ephemeral: true });
    }
  },
};
