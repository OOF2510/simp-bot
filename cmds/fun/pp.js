const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd_name")
    .setDescription("cmd desc")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("description")
        .setRequired(true / false)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let recipient = interaction.options.getUser("user") || interaction.author;

    let response;
    let recMem = guild.members.cache.get(recipient.id);

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
      const ppEm = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else if (recipient.id == "463119267832004620") {
      //noah
      response = ".";
      const ppEm = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else if (recipient.id == "763480802511945789") {
      //gerrardo
      response = "8===================================================D";
      const ppEm = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    } else {
      response = responses[Math.floor(Math.random() * responses.length)];

      const ppEm = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .addFields({ name: `${recNick}'s pp`, value: `${response}` });

      msg.reply({ embeds: [ppEm] });
    }
  },
};
