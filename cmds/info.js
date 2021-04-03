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
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        function millisecondsToStr(milliseconds) {
            // TIP: to find current time in milliseconds, use:
            // var  current_time_milliseconds = new Date().getTime();

            function numberEnding(number) {
                return (number > 1) ? 's' : '';
            }

            var temp = Math.floor(milliseconds / 1000);
            var years = Math.floor(temp / 31536000);
            if (years) {
                return years + ' year' + numberEnding(years);
            }
            //TODO: Months! Maybe weeks? 
            var days = Math.floor((temp %= 31536000) / 86400);
            if (days) {
                return days + ' day' + numberEnding(days);
            }
            var hours = Math.floor((temp %= 86400) / 3600);
            if (hours) {
                return hours + ' hour' + numberEnding(hours);
            }
            var minutes = Math.floor((temp %= 3600) / 60);
            if (minutes) {
                return minutes + ' minute' + numberEnding(minutes);
            }
            var seconds = temp % 60;
            if (seconds) {
                return seconds + ' second' + numberEnding(seconds);
            }
            return 'less than a second'; //'just now' //or other string you like;
        }

        var uptimeMilsec = os.uptime() * 1000;
        var uptime = millisecondsToStr(uptimeMilsec);
        var botUptimeMilsec = process.uptime() * 1000;
        var botUptime = millisecondsToStr(botUptimeMilsec);
        var memUsageB = process.memoryUsage().heapUsed;
        var memUsage = formatBytes(memUsageB);
        var totalSysMem = os.totalmem();
        var freeSysMem = os.freemem();
        var usedSysMem = totalSysMem - freeSysMem;
        var sysMemUsage = formatBytes(usedSysMem);

        let Distro = await exec('hostnamectl | grep -i "operating system"');
        if (!Distro) Distro = 'Error getting distro - Probably Windows';
        let distro = Distro.stdout.trim().replace('Operating System: ', ``);

        let NodeV = await exec('node -v');
        let nodeV = NodeV.stdout.trim(); 

        let DjsV = await exec('npm view discord.js version');
        let djsV = DjsV.stdout.trim()

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
                { name: 'Bot RAM Usage', value: '`' + memUsage + '`', inline: true },
                { name: 'System RAM Usage', value: '`' + sysMemUsage + '`', inline: true },
                { name: `NodeJS Version`, value: '`' + nodeV + '`', inline: true },
                { name: `Discord.js Version`, value: '`' + djsV + '`', inline: true },
                { name: `System Uptime`, value: '`' + uptime + '`', inline: true },
                { name: `Bot Uptime`, value: '`' + botUptime + '`', inline: true },
            )
            .setColor('RANDOM')

        channel.send(infoEm)
    }
}