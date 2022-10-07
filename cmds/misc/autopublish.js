const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autopublish")
    .setDescription(
      "auto-publish (crosspost) your messages in announcement channels"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("enable or disable")
        .setRequired(true)
        .setChoices(
          { name: "Enable", value: "TRUE" },
          { name: "Disable", value: "FALSE" }
        )
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
    let status = interaction.options.getString("status");
    try {
      await db.query(
        `REPLACE INTO \`${config.mysql.schema}\`.\`autopub\` (\`serverid\`, \`status\`) VALUES (${msg.guild.id}, ${status}) ;`
      );
      msg.reply(`AutoPublish: ${status}`);
    } catch (e) {
      msg.reply({ content: `Error!`, ephemeral: true });
    }
  },
};
