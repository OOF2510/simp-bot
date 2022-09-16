const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("sends the current music queue")
    ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction

    const queue = client.distube.getQueue(msg)
    if (!queue) return msg.reply(`${client.emotes.error} | There is nothing playing!`)
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    msg.reply(`${client.emotes.queue} | **Server Queue**\n${q}`)
  },
};