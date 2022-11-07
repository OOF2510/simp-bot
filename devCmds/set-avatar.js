const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-avatar")
    .setDescription("[DEV] Set the bot's avatar")
    .addAttachmentOption((option) =>
      option
        .setName("avatar")
        .setDescription("The avatar to set")
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
    if (!allowed.includes(msg.author.id))
      return msg.reply(
        `Only the developer & certian whitelisted users can use that command!`,
        { ephemeral: true }
      );
    let avatar = interaction.options.getAttachment("avatar");

    if (avatar.width && avatar.height) {
      await client.user.setAvatar(avatar);
      await msg.reply("Avatar set!");
    } else
      return msg.reply({ content: "That's not an image!", ephemeral: true });
  },
};
