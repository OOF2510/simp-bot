const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("enables or disables autoplay for your queue")
    ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");
    
    const queue = client.distube.getQueue(msg)
    if (!queue) return msg.reply(`${client.emotes.error} | There is nothing in the queue right now!`)
    const autoplay = queue.toggleAutoplay()
    msg.reply(`${client.emotes.success} | AutoPlay \`${autoplay ? 'enabled' : 'disabled'}\``)
  },
};