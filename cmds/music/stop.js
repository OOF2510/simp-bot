const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop playing music and leave the VC"),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(`${client.emotes.error} | There is nothing playing!`);
    queue.stop();
    msg.reply(`${client.emotes.success} | Stopped & left!`);
  },
};
