const { SlashCommandBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const hf = require("huggingface-api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gpt2")
    .setDescription("Completes text using OpenAi's GPT2")
    .addStringOption((option) =>
      option
        .setName("startingtext")
        .setDescription("Text for the ai to work with")
        .setRequired(true)
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
    let text = interaction.options.getString("startingtext");

    await msg.reply({
      content: "Generating text, please wait...",
      ephemeral: false,
    });

    hf.request({
      text: text,
      model: "gpt2",
      api_key: `${config.hfKey}`,
      return_type: "STRING",
    })
      .then((generatedText) => {
        msg.editReply({ content: `${generatedText}`, ephemeral: false });
      })
      .catch((e) => {
        msg.editReply({
          content: `That didn't work, try again later!`,
          ephemeral: true,
        });
      });
  },
};
