const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");
let { QueryTypes } = require("sequelize");

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
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let user = interaction.options.getUser("user");

    let reasons = await db.query(
      `SELECT reason FROM ${config.mysql.schema}.warns WHERE userid = ${user.id} AND serverid = ${msg.guild.id}`,
      { type: QueryTypes.SELECT }
    );
    if (!reasons)
      return msg.reply(`Could not find any warnings for \`${user.tag}\``);

    await msg.deferReply();

    if (reasons.length > 25) {
      let rJSON = JSON.stringify(reasons);
      let buffer = Buffer.from(rJSON, "utf-8");
      let attachment = new AttachmentBuilder(buffer, { name: "warnings.json" });
      await msg.editReply({
        content: `\`${user.tag}\` has more than 25 warnings, reasons cannot be put in an embed, a JSON file is attached\nWarning Count: ${reasons.length}`,
        files: [attachment],
      });
      return;
    }
    let em = new Discord.EmbedBuilder()
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
