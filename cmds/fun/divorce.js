const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("End your current marriage"),
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
    
    await msg.deferReply()

    let married = await db.query(
      `SELECT id FROM ${config.mysql.schema}.marriges WHERE serverid = ${serverId} AND (userid = ${author.id} OR spouseid = ${author.id});`,
      { plain: true, type: Sequelize.QueryTypes.SELECT }
    );
    if (!married)
      return msg.editReply(
        `You're not married! You can't end a marriage that doesn't exist!`
      );

    await db.query(
      `DELETE FROM ${config.mysql.schema}.marriges WHERE serverid = ${serverId} AND (userid = ${author.id} OR spouseid = ${author.id})`
    );
    msg.editReply('You are now successfully divorced!')
  },
};
