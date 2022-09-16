const { SlashCommandBuilder } = require("discord.js");
const { getPost } = require("random-reddit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("get a random post from specified subreddit")
    .addStringOption((option) =>
      option
        .setName("subreddit")
        .setDescription("subreddit name (without 'r/')")
        .setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let sub = interaction.options.getString("subreddit");

    try {
      let em = new Discord.EmbedBuilder();
      let post = await getPost(`${sub}`);
      if (post.over_18 && !msg.channel.nsfw)
        return msg.reply({
          content: `Oops! That post is NSFW, and this channel is not!`,
          ephemeral: true,
        });
      switch (post.selftext) {
        case "":
          em.setTitle(`${post.title ? post.title : "Error getting title"}`)
            .setImage(`${post.url}`)
            .setColor(config.embedColor)
            .setFooter({
              text: `${post.subreddit_name_prefixed}`,
              iconURL:
                "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png",
            })
            .setURL(`https://www.reddit.com${post.permalink}`);
          msg.reply({ embeds: [em] });
          break;
        default:
          em.setTitle(`${post.title ? post.title : "Error getting title"}`)
            .setDescription(
              `${post.selftext ? post.selftext : "Error getting post content"}`
            )
            .setColor(config.embedColor)
            .setFooter({
              text: `${post.subreddit_name_prefixed}`,
              iconURL:
                "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png",
            })
            .setURL(`https://www.reddit.com${post.permalink}`);
          msg.reply({ embeds: [em] });
          break;
      }
    } catch (e) {
      msg.reply({
        content: `Are you sure that subreddit exists?`,
        ephemeral: true,
      });
    }
  },
};
