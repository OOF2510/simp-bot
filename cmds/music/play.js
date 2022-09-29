const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays requested song in VC")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("song name or link")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    try {
      let msg = interaction;
      let song = interaction.options.getString("song");
      if (!msg.member.voice.channel)
        return msg.reply("You must be in a voice channel to do that!");

      await msg.reply({ content: `Searching \`${song}\``, ephemeral: true });

      client.distube
        .play(msg.member.voice.channel, song, {
          member: msg.member,
          textChannel: msg.channel,
          msg,
        })
        .catch((e) => {
          msg.editReply({
            content: `Error! If Simp Bot is already in this voice channel from using \`tts\`, diconnect it, then try again`,
            ephemeral: true,
          });
        });
    } catch (e) {
      msg.editReply({
        content: `Error! If Simp Bot is already in this voice channel from using \`tts\`, diconnect it, then try again`,
        ephemeral: true,
      });
    }
  },
};
