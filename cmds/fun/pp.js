const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pp")
    .setDescription("pp size")
    .addUserOption((option) =>
      option.setName("user").setDescription("description").setRequired(false)
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
    let recipient = interaction.options.getUser("user") || interaction.author;

    let response;
    let recMem = msg.guild.members.cache.get(recipient.id);

    let recNick = recMem ? recMem.displayName : recipient.username;

    let responses = [
      "8D",
      "8=D",
      "8==D",
      "8===D",
      "8====D",
      "8=====D",
      "8======D",
      "8=======D",
      "8========D",
      "8=========D",
      "8==========D",
      "8===========D",
    ];

    if (recipient.id == "463119138500378624") {
      //me
      response = "8======================================================D";
      const ppEm = new EmbedBuilder()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else if (recipient.id == "463119267832004620") {
      //noah
      response = ".";
      const ppEm = new EmbedBuilder()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else if (recipient.id == "763480802511945789") {
      //gerrardo
      response = "8===================================================D";
      const ppEm = new EmbedBuilder()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else {
      response = responses[Math.floor(Math.random() * responses.length)];

      const ppEm = new EmbedBuilder()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    }
  },
};
