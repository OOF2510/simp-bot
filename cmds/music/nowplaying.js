const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("now-playing")
    .setDescription("gets the currently playing song"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    const song = queue.songs[0];
    msg.reply(`${client.emotes.play} | I'm playing **\`${song.name}\`**`);
  },
};
