const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("flip a coin"),
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

    let sides = ["Heads", "Tails"];
    let result = sides[Math.floor(Math.random() * sides.length)];
    let img;

    switch (result) {
      case "Heads":
        img =
          "https://media.discordapp.net/attachments/1021763955099717664/1021768326504005735/Heads.png";
        break;

      case "Tails":
        img =
          "https://media.discordapp.net/attachments/1021763955099717664/1021768326860525728/Tails.png";
        break;

      default:
        break;
    }

    let embed = new EmbedBuilder()
      .setTitle(`${result}`)
      .setImage(`${img}`)
      .setColor(config.embedColor);

    msg.reply({ embeds: [embed] });
  },
};
