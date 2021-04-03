module.exports = {
    name: 'serverlist',
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
        if (allowed.includes(author.id)) {
            channel.send(`${client.guilds.cache.size} servers:`)

            client.guilds.cache.forEach(async guild => {
                let noInfo = await niDB.get(guild.id)
                if (noInfo) return msg.channel.send("This server requested for info to not be shared!")
                let owner = guild.ownerID;
                let defC = getDefaultChannel(guild);
                async function sendSL() {
                    let invite = await defC.createInvite(
                        {
                            maxAge: 10 * 60 * 1000,
                            maxUses: 1
                        });
                    let inv = invite ? `<${invite}>` : `Error creating invite`
                    let devSlEm = new Discord.MessageEmbed()
                        .setTitle(guild.name)
                        .setDescription(guild.id)
                        .setColor('RANDOM')
                        .addFields(
                            { name: `Member count`, value: guild.memberCount, inline: true },
                            { name: `Owner ID`, value: owner, inline: true },
                            { name: `Invite`, value: inv, inline: true }
                        )
                    channel.send(devSlEm);
                }
                sendSL();
            })
        } else {
            let slEm = new Discord.MessageEmbed()
                .setTitle(`Server Count`)
                .setDescription(`${client.user.username} is in **${client.guilds.cache.size}** servers!`)
                .setColor('RANDOM')
                .setFooter(`Requested by ${msg.author.username}`, msg.author.displayAvatarURL());

            msg.channel.send(slEm);
        }
    }
}