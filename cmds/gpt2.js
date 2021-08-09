const hf = require("huggingface-api");

module.exports = {
  name: "gpt2",
  aliases: ["aitext", "ai-text", "aitxt", "ai-complete", "autocomplete", "gpt"],
  cat: "fun",
  usage: "gpt3 <starting text>",
  desc: "Completes text using OpenAi's GPT2",
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
    blDB,
    wcDB,
    djDB
  ) {
    if (!args[0]) return msg.reply(`Usage: \`${this.usage}\``);
    let text = args.join(" ");

    msg.reply("Generating text, please wait...");

    hf.request({
      text: `${text}`,
      model: "EleutherAI/gpt-neo-2.7B",
      api_key: `${config.hfKey}`,
      return_type: "STRING",
    }).then((data) => {
      msg.reply(data);
    });
  },
};
