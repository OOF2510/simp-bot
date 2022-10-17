const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { CommandInteraction, Client, User } = require("discord.js"),
  Sequelize = require("sequelize");

/**
 * Marriage logic
 * @param {User} user
 * @param {Sequelize} db
 * @param {*} config
 * @param {CommandInteraction} msg
 * @returns {*}
 */
async function marry(user, db, config, msg) {
  let author = msg.user;
  let serverId = msg.guild.id;
  if (msg.author.id === user.id) return msg.reply("You cannot marry yourself!");
  let married = await db.query(
    `SELECT id FROM ${config.mysql.schema}.marriges WHERE serverid = ${serverId} AND (userid = ${author.id} OR spouseid = ${author.id});`,
    { plain: true, type: Sequelize.QueryTypes.SELECT }
  );
  if (married)
    return msg
      .reply(
        `You're already married! You must divorce your current partner if you want to do that!`
      )
      .catch((e) => {
        return;
      });

  let userMarried = await db.query(
    `SELECT id FROM ${config.mysql.schema}.marriges WHERE serverid = ${serverId} AND (userid = ${user.id} OR spouseid = ${user.id});`,
    { plain: true, type: Sequelize.QueryTypes.SELECT }
  );
  if (userMarried)
    return msg.reply(
      `${user} is already married! They must get divorced for you to marry them!`
    );

  if (user.bot) {
    await msg.deferReply();
    await db.query(
      `INSERT INTO ${config.mysql.schema}.marriges (serverid, userid, spouseid) VALUES (${serverId}, ${author.id}, ${user.id});`
    );
    return msg.editReply(`Congratulations! You are now married!`);
  }

  let row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("Yes!")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("no")
      .setLabel("No!")
      .setStyle(ButtonStyle.Danger)
  );

  let reply = await msg.reply({
    content: `${user}, would you like to marry ${author}?`,
    components: [row],
  });
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate();
    if (i.user.id === user.id && i.customId === "yes") {
      await db.query(
        `INSERT INTO ${config.mysql.schema}.marriges (serverid, userid, spouseid) VALUES (${serverId}, ${author.id}, ${user.id});`
      );
      await i.editReply({
        content: `Congratulations! You are now married!`,
        components: [],
      });
    } else if (i.user.id === user.id && i.customId === "no") {
      await i.editReply({ content: `Rejected!`, components: [] });
    } else return;
  });

  collector.on("end", async (col) => {
    let colA = Array.from(col);
    if (!colA[0])
      return msg.editReply({
        content: `Nothing was selected! Try again!`,
        components: [],
      });
  });
}

module.exports = {
  marry,
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("propose to a server member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to propose to")
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
    let user = interaction.options.getUser("user");

    try {
      await marry(user, db, config, msg);
    } catch (e) {
      return;
    }
  },
};
