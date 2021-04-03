module.exports = {
    name: 'invite',
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
        msg.reply(`Here's my invite link: <https://discord.com/api/oauth2/authorize?client_id=808822189905936405&permissions=8&scope=bot>`)
    }
}