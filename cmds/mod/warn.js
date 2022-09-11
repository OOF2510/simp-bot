const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to warn")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for warn")
                .setRequired(false)
        )
    ,
    async execute(interaction, client, config, db, Discord, allowed) {
        let msg = interaction
        let reason = interaction.options.getString("reason");
        let user = interaction.options.getUser("user")

        if (reason) {
            try {
                await user.send(`You have been warned in **${msg.guild}** by **${msg.author.tag}** for \`${reason}\``)
                msg.reply(`${user.tag} has been warned!`)
            } catch (e) {
                return msg.reply('Cannot warn this user! They probably have me blocked \:(')
            }

        } else if (!reason) {
            try {
                await user.send(`You have been warned in **${msg.guild}** by **${msg.author.tag}`)
                msg.reply(`${user.tag} has been warned!`)
            } catch (e) {
                return msg.reply('Cannot warn this user! They probably have me blocked \:(')
            }
        }
    },
};