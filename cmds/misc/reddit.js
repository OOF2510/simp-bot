const { SlashCommandBuilder } = require("discord.js");
const { getPost } = require('random-reddit')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("get a random post from specified subreddit")
    .addStringOption((option) =>
      option
        .setName("subreddit")
        .setDescription("subreddit name (without 'r/')")
        .setRequired(true)
    )
    ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction
    let sub = interaction.options.getString("subreddit");
    
    try {
        let em = new Discord.embedBuilder()
        let post = await getPost(`${sub}`);
        switch (post.selftext) {
          case "":
            em.setTitle(`${post.title? post.title : 'Error getting title'}`).setImage(`${post.url}`).setColor(config.embedColor).setFooter({ text: `${post.subreddit_name_prefixed}`, iconURL: 'https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png' })
            msg.reply({ embeds: [em] });
            break;
          default:
            em.setTitle(`${post.title? post.title : 'Error getting title'}`).setDescription(`${post.selftext? post.selftext : 'Error getting post content'}`).setColor(config.embedColor).setFooter({ text: `${post.subreddit_name_prefixed}`, iconURL: 'https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png' })
            msg.reply({ embeds: [em] });
            break;
        }
      } catch (e) {
        msg.reply(`Are you sure that subreddit exists?\n\`${e}\``);
      }
  },
};