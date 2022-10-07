const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip the playing song"),
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    const queue = client.distube.getQueue(msg);
    if (!queue)
      return msg.reply(
        `${client.emotes.error} | There is nothing in the queue right now!`
      );
    try {
      const song = await queue.skip();
      msg.reply(
        `${client.emotes.success} | Skipped! Now playing:\n${song.name}`
      );
    } catch (e) {
      msg.reply(`${client.emotes.error} | ${e}`);
    }
  },
};
