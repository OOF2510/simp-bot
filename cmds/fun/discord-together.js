const { SlashCommandBuilder } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discord-together")
    .setDescription("Play games, watch youtube, etc. in a vc!")
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("choose one")
        .setRequired(true)
        .addChoices(
          { name: "Youtube", value: "youtube" },
          { name: "Poker", value: "poker" },
          { name: "Chess", value: "chess" },
          { name: "Checkers", value: "checkers" },
          { name: "Fishington", value: "fishington" },
          { name: "Letter Tile", value: "lettertile" },
          { name: "Words Snack", value: "wordsnack" },
          { name: "Doodle Crew", value: "doodlecrew" },
          { name: "SpellCast", value: "spellcast" },
          { name: "Betrayal", value: "betrayal" },
          { name: "Awkword", value: "awkword" },
          { name: "Puttparty", value: "puttparty" },
          { name: "Sketchheads", value: "sketchheads" },
          { name: "Ocho", value: "ocho" }
        )
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
    let activity = interaction.options.getString("activity");
    let member = msg.guild.members.cache.get(`${msg.author.id}`);
    if (!msg.member.voice.channel)
      return msg.reply("You must be in a voice channel to do that!");

    client.discordTogether
      .createTogetherCode(member.voice.channel.id, `${activity}`)
      .then(async (invite) => {
        return msg.reply(`Click the **link**: ${invite.code}`);
      });
  },
};
