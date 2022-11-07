const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
const Craiyon = require("craiyon");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const https = require("https");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("craiyon-dalle")
    .setDescription(
      "Uses Dalle-2 or Craiyon to grenerate an image based on a prompt. This can take up to 3 mins to run."
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("prompt to base image off of")
        .setRequired(true)
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {Sequelize} db
   * @param {Array} allowed
   */
  async execute(interaction, client, config, db, allowed) {
    let msg = interaction;
    let prompt = interaction.options.getString("prompt");

    await msg.deferReply();

    const imgId = Math.random().toString(36).substring(2, 15);

    try {
      const configuration = new Configuration({ apiKey: config.openaiApiKey });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createImage({
        prompt: `${prompt}`,
        n: 1,
        size: "1024x1024",
      });
      let imageUrl = response.data.data[0].url;

      if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
      if (!fs.existsSync("./temp/dall-e")) fs.mkdirSync("./temp/dall-e");
      const file = fs.createWriteStream(
        `./temp/dall-e/${prompt.replaceAll('/', '--')}-${msg.guildId}_${imgId}.png`
      );

      // save image to file asynchronusly using await
      await new Promise((resolve, reject) => {
        https
          .get(imageUrl, (response) => {
            response.pipe(file);
            file
              .on("finish", () => {
                file.close();
                resolve();
              })
              .on("error", (err) => {
                reject(err.message);
              });
          })
          .on("error", (err) => {
            reject(err.message);
          });
      });

      let dalleAttach = new AttachmentBuilder()
        .setFile(`./temp/dall-e/${prompt.replaceAll('/', '--')}-${msg.guildId}_${imgId}.png`)
        .setName(`${prompt.replaceAll('/', '--')}.png`);

      await msg.editReply({
        content: `Prompt: **${prompt}**\nGenerated using: \`OpenAI Dalle-2\``,
        files: [dalleAttach],
      });
    } catch (e) {
      try {
        const craiyon = new Craiyon.Client();

        let result = await craiyon.generate({ prompt: `${prompt}` });
        let buffer = result.images[0].asBuffer();

        if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        if (!fs.existsSync("./temp/craiyon")) fs.mkdirSync("./temp/craiyon");
        // save image to file asynchronusly using await
        await new Promise((resolve, reject) => {
          fs.writeFile(
            `./temp/craiyon/${prompt.replaceAll('/', '--')}-${msg.guildId}_${imgId}.jpg`,
            buffer,
            (err) => {
              if (err) reject(err.message);
              resolve();
            }
          ).catch((e) => {
            reject(e);
          });
        });

        let craiyonAttach = new AttachmentBuilder()
          .setFile(`./temp/craiyon/${prompt.replaceAll('/', '--')}-${msg.guildId}_${imgId}.jpg`)
          .setName(`${prompt.replaceAll('/', '--')}.jpg`);

        await msg.editReply({
          content: `Prompt: **${prompt}**\nGenerated using: \`Craiyon\``,
          files: [craiyonAttach],
        });
      } catch (e) {
        return;
      }
    }
  },
};
