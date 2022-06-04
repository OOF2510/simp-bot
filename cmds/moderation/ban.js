const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("bans specified member from the server")
    .setDefaultMemberPermissions(["BAN_MEMBERS"])
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("reason for banning")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ban").setRequired(true)
    ),
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let Reason = interaction.options.getString("reason");
    let user = interaction.options.getUser("user");
    let member = msg.guild.members.cache.get(user.id);

    if (member.id === msg.guild.me.id) return msg.reply("I cannot ban myself!");
    if (member.id === author.id) return msg.reply("You can't ban yourself!");
    if (!member.bannable)
      return msg.channel.send(
        "I cannot ban this member, make sure my highest role is above their highest role!"
      );

    let reason = Reason
      ? Reason + ` (Performed by ${author.tag})`
      : `Performed by ${author.tag}`;
    await member.ban({ reason: reason });
    msg.reply(`✅ Successfully banned **${member.user.tag}**`);
  },
};
