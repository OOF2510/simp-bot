module.exports = {
    name: 'info',
    async execute(
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
        var uptime = os.uptime() / 60
        var up = Math.round(uptime);

        let Distro = await exec('hostnamectl | grep -i "operating system"');
        if (!Distro) Distro = 'Error getting distro - Probably Windows';
        let distro = Distro.stdout.trim().replace('Operating System: ', ``);

        let infoEm = new Discord.MessageEmbed()
            .setTitle('Info')
            .addFields(
                { name: 'Server Info', value: 'Information about the server' },
                { name: 'Members', value: guild.memberCount, inline: true },
                { name: 'Roles', value: guild.roles.cache.size, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Server Owner', value: guild.owner, inline: true },
                { name: 'Default Channel', value: defChannel, inline: true },
                { name: 'Prefix', value: prefix, inline: true },
                { name: 'OS Info', value: `Information about the bot's OS`, inline: false },
                { name: 'Type', value: '`' + os.type() + '`', inline: true },
                { name: 'Arch', value: '`' + os.arch() + '`', inline: true },
                { name: 'Release', value: '`' + os.release() + '`', inline: true },
                { name: 'Version', value: '`' + os.version() + '`', inline: true },
                { name: 'Linux Distro', value: '`' + distro + '`', inline: true },
                { name: `Uptime`, value: '`' + up + 'mins`', inline: true },
            )
            .setColor('RANDOM')

        channel.send(infoEm)
    }
}