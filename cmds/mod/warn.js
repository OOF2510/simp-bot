const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  User,
  Guild,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

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
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let reason = interaction.options.getString("reason");
    let user = interaction.options.getUser("user");

    await msg.deferReply();
    /**
     * Adds warning to database
     * @param {User} user
     * @param {Guild} guild
     * @param {String} reason
     */
    async function addToDB(user, guild, reason) {
      if (!reason) reason = "No reason provided!";

      await db.query(
        `INSERT INTO ${config.mysql.schema}.warns (userid, serverid, reason) VALUES (${user.id}, ${guild.id}, '${reason}')`
      );
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
