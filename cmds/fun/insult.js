const { SlashCommandBuilder } = require("discord.js");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("generate an insult")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to insult").setRequired(false)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");

    try {
      let response = await got(
        "https://evilinsult.com/generate_insult.php?lang=en&type=text"
      );
      let insult = response.body;

      if (user) {
        msg.reply(`${user} ${insult}`);
      } else {
        msg.reply(`${insult}`);
      }
    } catch (e) {
      msg.reply({ content: "Error!", ephemeral: true });
    }
  },
};
