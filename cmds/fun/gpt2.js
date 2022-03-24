const { SlashCommandBuilder } = require("@discordjs/builders");
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
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let text = interaction.options.getString("startingText");

    msg.channel.send("Generating text, please wait...");
    msg.channel.send("COMMAND BROKEN")

    // hf.request({
    //   text: `${text}`,
    //   model: "EleutherAI/gpt-neo-2.7B",
    //   api_key: `${config.hfKey}`,
    //   return_type: "STRING",
    // }).then((data) => {
    //   msg.reply(data);
    // });
  },
};
