const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-warns")
    .setDescription("Check warnings for specified user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to check warnings for")
        .setRequired(true)
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
    let user = interaction.options.getUser("user");

    await msg.deferReply();

    const collections = dbContext?.collections;

    if (!collections?.warnings) {
      return msg.editReply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    let reasons = await collections.warnings
      .find({ userId: String(user.id), serverId: String(msg.guild.id) })
      .toArray();
    if (!reasons[0])
      return msg.editReply(`Could not find any warnings for \`${user.tag}\``);

    if (reasons.length > 25) {
      let rJSON = JSON.stringify(reasons.map(({ reason }) => ({ reason })));
      let buffer = Buffer.from(rJSON, "utf-8");
      let attachment = new AttachmentBuilder(buffer, { name: "warnings.json" });
      await msg.editReply({
        content: `\`${user.tag}\` has more than 25 warnings, reasons cannot be put in an embed, a JSON file is attached\nWarning Count: ${reasons.length}`,
        files: [attachment],
      });
      return;
    }
    let em = new EmbedBuilder()
      .setTitle(`Warnings for ${user.tag}:`)
      .setColor(config.embedColor);

    var i = 1;
    await reasons.forEach(({ reason }) => {
      em.addFields({
        name: `Warning #${i}`,
        value: `Reason: **${reason}**`,
        inline: true,
      });
      i++;
    });

    msg.editReply({ embeds: [em] });
  },
};
