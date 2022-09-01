const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans specified member from the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(false)
    )
    ,
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction
    //let string = interaction.options.getString("stringoptionname");
    //let user = interaction.options.getUser("user") || interaction.author;
    if (!msg.member.permissions.has("BAN_MEMBERS"))
      return msg.reply("You must have the `BAN_MEMBERS` permission to do that");
    if (!msg.guild.me.permissions.has("BAN_MEMBERS"))
      return msg.reply("I must have the `BAN_MEMBERS` permission to do that");
    if (!args[0]) return msg.reply("Please specify a member to ban!");

    let member =
      msg.mentions.members.first() ||
      msg.guild.members.cache.get(args[0]) ||
      msg.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      msg.guild.members.cache.find(
        (ro) => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()
      );
    if (!member) {
      let Reason = args.slice(1).join(" "),
        reason = Reason
          ? Reason + ` (Performed by ${author.tag})`
          : `Performed by ${author.tag}`;

      return guild.members
        .ban(`${args[0]}`, { reason: reason })
        .then((banInfo) =>
          msg.reply(
            `✅ Successfully banned **${
              banInfo.user?.tag ?? banInfo.tag ?? banInfo
            }**`
          )
        )
        .catch((err) => {
          msg.reply("Could not ban that user!");
        });
    }
    if (member.id === msg.guild.me.id) return msg.reply("I cannot ban myself!");
    if (member.id === author.id) return msg.reply("You can't ban yourself!");
    if (!member.bannable)
      return msg.channel.send(
        "I cannot ban this member, make sure my highest role is above their highest role!"
      );

    let Reason = args.slice(1).join(" "),
      reason = Reason
        ? Reason + ` (Performed by ${author.tag})`
        : `Performed by ${author.tag}`;

    await member.ban({ reason: reason });
    msg.reply(`✅ Successfully banned **${member.user.tag}**`);
  },
};