const emojis = ["👍", "👎", "❔", "🤔", "🙄", "❌"];
const isPlaying = new Set();
const { Aki } = require("aki-api");
module.exports = {
  name: "akinator",
  aliases: ["aki"],
  cat: "fun",
  usage: "akinator",
  desc: "Starts a game of Akinator",
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
    db
  ) {
    if (isPlaying.has(msg.author.id)) {
      return msg.channel.send(":x: | The game already started..");
    }

    isPlaying.add(msg.author.id);

    const aki = new Aki("en");
    // Gamertag: Airstriker76
    channel.send("Starting Akinator game...");

    await aki.start();

    let akiEm = new Discord.MessageEmbed()
      .setTitle(`${msg.author.username}, Question ${aki.currentStep + 1}`)
      .setColor(config.embedColor)
      .setDescription(
        `**${aki.question}**\n${aki.answers
          .map((an, i) => `${an} | ${emojis[i]}`)
          .join("\n")}`
      );

    const akiMsg = await msg.channel.send({ embeds: [akiEm] });

    for (const emoji of emojis) await akiMsg.react(emoji);

    const collector = akiMsg.createReactionCollector(
      (reaction, user) =>
        emojis.includes(reaction.emoji.name) && user.id == msg.author.id,
      {
        time: 60000 * 6,
      }
    );

    collector
      .on("end", () => isPlaying.delete(msg.author.id))
      .on("collect", async ({ emoji, users }) => {
        users.remove(msg.author).catch(() => null);

        if (emoji.name == "❌") {
          channel.send("Game cancelled!");
          return collector.stop();
        }

        await aki.step(emojis.indexOf(emoji.name));

        if (aki.progress >= 70 || aki.currentStep >= 78) {
          await aki.win();

          collector.stop();

          let isCharEm = new Discord.MessageEmbed()
            .setTitle("Is this your character?")
            .setDescription(
              `**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**\n\n[yes (👍) / no (👎)]`
            )
            .setImage(aki.answers[0].absolute_picture_path)
            .setColor(config.embedColor);

          let isCharMsg = await msg.channel.send({ embeds: [isCharEm] });

          let emojis2 = ["👍", "👎"];

          for (const emoji of emojis2) await isCharMsg.react(emoji);

          const collector2 = isCharMsg.createReactionCollector(
            (reaction, user) =>
              emojis2.includes(reaction.emoji.name) && user.id == msg.author.id,
            {
              time: 60000 * 6,
            }
          );

          collector2.on("collect", async ({ emoji, users }) => {
            users.remove(msg.author).catch(() => null);
            if (emoji.name == "👍") {
              let winEm = new Discord.MessageEmbed()
                .setTitle("Great! Guessed right one more time.")
                .setColor(config.embedColor)
                .setDescription("I love playing with you!");
              msg.channel.send({ embeds: [winEm] });
              collector2.stop();
            } else if (emoji.name == "👎") {
              let winEm = new Discord.MessageEmbed()
                .setTitle("*Sigh*. You won.")
                .setColor(config.embedColor)
                .setDescription("I love playing with you!");
              msg.channel.send({ embeds: [winEm] });
              collector2.stop();
            }
          });
        } else {
          let newEm = new Discord.MessageEmbed()
            .setTitle(`${msg.author.username}, Question ${aki.currentStep + 1}`)
            .setColor(config.embedColor)
            .setDescription(
              `**${aki.question}**\n${aki.answers
                .map((an, i) => `${an} | ${emojis[i]}`)
                .join("\n")}`
            );
          akiMsg.edit({ embeds: [newEm] });
        }
      });
  },
};
