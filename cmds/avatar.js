module.exports = {
    name: 'avatar',
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
        let user = author;
        let mem = msg.member;
        if (msg.mentions.users) user = msg.mentions.users.first();
        if (msg.mentions.users) mem = msg.mentions.members.first();

        let userNick = mem ? mem.displayName : user.username;

        let av = user.avatarURL({ dynamic: true });

        let avEm = new Discord.MessageEmbed()
            .setTitle(`${userNick}'s Avatar`)
            .setImage(av)
            .setColor('RANDOM')
            .setTimestamp();

        channel.send(avEm);
    }
}