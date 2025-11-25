const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  User,
  Guild,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("User to warn").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for warn")
        .setRequired(false)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").Collection}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let msg = interaction;
    let reason = interaction.options.getString("reason");
    let user = interaction.options.getUser("user");
    const collections = dbContext?.collections;

    await msg.deferReply();

    if (!collections?.warnings) {
      return msg.editReply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    /**
     * Adds warning to database
     * @param {User} user
     * @param {Guild} guild
     * @param {String} reason
     */
    async function addToDB(user, guild, reason) {
      if (!collections?.warnings) return;
      if (!reason) reason = "No reason provided!";

      await collections.warnings.insertOne({
        userId: String(user.id),
        serverId: String(guild.id),
        reason,
        createdAt: new Date(),
      });
    }

    if (reason) {
      try {
        await user.send(
          `You have been warned in **${msg.guild}** by **${msg.author.tag}** for \`${reason}\``
        );
        await addToDB(user, msg.guild, reason);
        msg.editReply(`\`${user.tag}\` has been warned!`);
      } catch (e) {
        return msg.editReply(
          "Cannot warn this user! They probably have me blocked :("
        );
      }
    } else if (!reason) {
      try {
        await user.send(
          `You have been warned in **${msg.guild}** by **${msg.author.tag}`
        );
        await addToDB(user, msg.guild);
        msg.editReply(`${user.tag} has been warned!`);
      } catch (e) {
        return msg.editReply(
          "Cannot warn this user! They probably have me blocked :("
        );
      }
    }
  },
};
