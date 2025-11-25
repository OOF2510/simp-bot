const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const akinator = require("discord.js-akinator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("akinator")
    .addStringOption((option) =>
      option
        .setName("game-type")
        .setDescription("Game type")
        .addChoices(
          { name: "Animal", value: "animal" },
          { name: "Character", value: "character" },
          { name: "Object", value: "object" }
        )
        .setRequired(false)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {*} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let msg = interaction;
    let gameType = interaction.options.getString("game-type");

    try {
      akinator(msg, {
        language: "en",
        childMode: false,
        gameType: `${gameType ? gameType : "character"}`,
        useButtons: true,
        embedColor: config.embedColor,
      }).catch((e) => {
        msg.channel.send("Error! Try again!");
      });
    } catch (e) {
      msg.channel.send("Error! Try again!");
    }
  },
};
