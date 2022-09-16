const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("sets music volume")
    .addIntegerOption((option) =>
      option
        .setName("percentage")
        .setDescription("volume percentage (without '%')")
        .setMinValue(parseInt(0))
        .setMaxValue(parseInt(500))
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let vol = parseInt(interaction.options.getInteger("percentage"));
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    if (isNaN(vol))
      return msg.reply(`${client.emotes.error} | Please enter a valid number!`);
    queue.setVolume(vol);
    msg.reply(`${client.emotes.success} | Volume set to \`${vol}%\``);
  },
};
