module.exports = {
    name: 'bugreport',
    execute(
        msg,
        args,
        client,
        channel,
        author,
        server,
        guild,
        botMem,
        botNick,
        testServer,
        defChannel,
        me,
        allowed,
        prefix,
        config,
        exec,
        os,
        Discord,
        preDB,
        nbDB,
        niDB,
        bchDB,
        blDB
    ) {
        const repCh = client.channels.cache.get('817885616791355404');
        const repCh2 = client.channels.cache.get('817885785637257216');
        const repCh3 = client.channels.cache.get('825841694712004669');
        const rep = msg.content.replace(`${prefix}bugreport`, ``);

        const repEm = new Discord.MessageEmbed()
            .setTitle(`New bug report`)
            .addFields(
                { name: `Report:`, value: `${rep}` }
            )
            .setFooter(`Reported by: ${msg.author.tag}`, msg.author.avatarURL())
            .setColor('RANDOM')
            .setTimestamp()

        repCh.send(repEm);
        repCh2.send(repEm);
        repCh3.send(repEm);

        msg.reply(`I have sent your bug report, queen!`);
    }
}