const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("flip a coin"),
  async execute(interaction, client, config, db, Discord, allowed) {
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

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${result}`)
      .setImage(`${img}`)
      .setColor(config.embedColor)

    msg.reply({ embeds: [embed] });
  },
};
