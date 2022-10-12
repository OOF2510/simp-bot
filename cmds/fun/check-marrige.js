const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-marrige")
    .setDescription("Check your current marrige"),
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
    let author = msg.author;
    let serverId = msg.guild.id;

    await msg.deferReply();

    let married = await db.query(
      `SELECT * FROM ${config.mysql.schema}.marriges WHERE serverid = ${serverId} AND (userid = ${author.id} OR spouseid = ${author.id});`,
      { plain: true, type: Sequelize.QueryTypes.SELECT }
    );
    if (!married) return msg.editReply(`You're not married!`);

    let user = msg.guild.members.cache.get(married.userid);
    let spouse = msg.guild.members.cache.get(married.spouseid);
    if (!user || !spouse) {
      return msg.editReply(
        `It seems that the user you were married to is no longer in this server, you might wanna divorce...`
      );
    }
    if (user.id === author.id)
      return msg.editReply(`You are married to ${spouse}`);
    else return msg.editReply(`You are married to ${user}`);
  },
};
