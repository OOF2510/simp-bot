const { SlashCommandBuilder } = require("@discordjs/builders");
const kanye = require("kanye.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("KanyeQuote")
        .setDescription("Gives a random quote by Kanye West"),
    async execute(interaction, client, config, db, Discord, allowed) {
        let msg = interaction

        let { quote } = await kanye();
        let quoteEm = new Discord.MessageEmbed()
            .setTitle(`"${quote}"`)
            .setFooter(`- Kanye West`)
            .setColor(config.embedColor);
        msg.reply({ embeds: [quoteEm] });
    },
};