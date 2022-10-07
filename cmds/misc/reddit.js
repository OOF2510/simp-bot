const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// for jsdoc
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
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
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let sub = interaction.options.getString("subreddit");

    try {
      let post = await getPost(`${sub}`);

      let em = new EmbedBuilder()
        .setTitle(`${post.title ? post.title : "Error getting title"}`)
        .setColor(config.embedColor)
        .setFooter({
          text: `${post.subreddit_name_prefixed}`,
          iconURL:
            "https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png",
        })
        .setURL(`https://www.reddit.com${post.permalink}`);

      if (post.over_18 && !msg.channel.nsfw)
        return msg.reply({
          content: `Oops! That post is NSFW, and this channel is not!`,
          ephemeral: true,
        });
      switch (post.selftext) {
        case "":
          em.setImage(`${post.url}`);

          msg.reply({ embeds: [em] });
          break;
        default:
          em.setDescription(
            `${post.selftext ? post.selftext : "Error getting post content"}`
          );

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
