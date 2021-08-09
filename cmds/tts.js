const voice = require("@discordjs/voice");
const fs = require("fs");
module.exports = {
  name: "tts",
  cat: "misc",
  usage: "tts <message>",
  desc: "Speaks given message in VC (in beta)",
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
    bchDB,
    blDB
  ) {
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");
    if (!args[0]) return msg.reply("Please provide a message to say!");

    let message = args.join(" ");

    if (!fs.existsSync("./temp")) {
      fs.mkdirSync("./temp");
    }

    let timeStamp = new Date();
    let filename = "./temp/" + timeStamp + ".mp3";

    await exec(`gtts-cli '${message}' --output "${filename}"`);

    const channelID = msg.member.voice.channelID;
    const Channel = client.channels.cache.get(channelID);

    const player = voice.createAudioPlayer();

    const connection = voice.joinVoiceChannel({
      channelId: channelID,
      guildId: Channel.guild.id,
      adapterCreator: Channel.guild.voiceAdapterCreator,
    });

    const resource = voice.createAudioResource(filename);
    player.play(resource);

    connection.subscribe(player);

    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata.title}`
      );
      player.stop();
    });

    player.on(voice.AudioPlayerStatus.Idle, () => {
      player.stop();
    });
  },
};
