const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { CommandInteraction, Client, User } = require("discord.js");

async function findMarriage(collections, serverId, userId) {
  return collections.marriages.findOne({
    serverId,
    $or: [{ userId }, { spouseId: userId }],
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("propose to a server member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to propose to")
        .setRequired(true),
    ),
  /**
   * Executes the command
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {*} config
   * @param {{collections: import("mongodb").Collection}} dbContext
   * @param {Array} allowed
   */
  async execute(interaction, client, config, dbContext, allowed) {
    let msg = interaction;
    let user =
      typeof interaction.options?.getUser === "function"
        ? interaction.options.getUser("user")
        : interaction.targetUser;
    if (!user) {
      return msg.reply({
        content: "I couldn't figure out who you want to marry.",
        ephemeral: true,
      });
    }
    const collections = dbContext?.collections;
    const serverId = String(msg.guild.id);
    const authorId = msg.user.id;

    if (!collections?.marriages || !collections?.proposals) {
      return msg.reply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    if (msg.author.id === user.id)
      return msg.reply("You cannot marry yourself!");

    const married = await findMarriage(collections, serverId, authorId);
    if (married)
      return msg.reply(
        `You're already married! You must divorce your current partner if you want to do that!`,
      );

    const userMarried = await findMarriage(collections, serverId, user.id);
    if (userMarried)
      return msg.reply(
        `${user} is already married! They must get divorced for you to marry them!`,
      );

    const pendingProposal = await collections.proposals.findOne({
      serverId,
      status: "pending",
      $or: [
        { proposerId: authorId },
        { targetId: authorId },
        { proposerId: user.id },
        { targetId: user.id },
      ],
    });

    if (pendingProposal) {
      return msg.reply(
        "There's already a pending proposal involving one of you. Resolve that first.",
      );
    }

    const proposalDoc = {
      serverId,
      proposerId: authorId,
      targetId: user.id,
      status: "pending",
      createdAt: new Date(),
    };

    const proposalInsert = await collections.proposals.insertOne(proposalDoc);
    const proposalId = proposalInsert.insertedId;
    const proposalKey = proposalId.toString();

    if (user.bot) {
      await collections.marriages.insertOne({
        serverId,
        userId: authorId,
        spouseId: user.id,
        proposalId,
        createdAt: new Date(),
      });
      await collections.proposals.updateOne(
        { _id: proposalId },
        { $set: { status: "accepted", resolvedAt: new Date() } },
      );
      return msg.reply(`Congratulations! You are now married!`);
    }

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`marry-yes-${proposalKey}`)
        .setLabel("Yes!")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`marry-no-${proposalKey}`)
        .setLabel("No!")
        .setStyle(ButtonStyle.Danger),
    );

    let reply = await msg.reply({
      content: `${user}, would you like to marry ${msg.user}?`,
      components: [row],
    });
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== user.id)
        return i.reply({ content: "This isn't for you!", ephemeral: true });
      await i.deferUpdate();

      const latestMarriage = await findMarriage(collections, serverId, user.id);
      const authorMarriage = await findMarriage(
        collections,
        serverId,
        authorId,
      );
      if (latestMarriage || authorMarriage) {
        await collections.proposals.updateOne(
          { _id: proposalId },
          { $set: { status: "cancelled", resolvedAt: new Date() } },
        );
        return i.editReply({
          content: `Someone is already married now. Proposal cancelled.`,
          components: [],
        });
      }

      if (i.customId === `marry-yes-${proposalKey}`) {
        await collections.marriages.insertOne({
          serverId,
          userId: authorId,
          spouseId: user.id,
          proposalId,
          createdAt: new Date(),
        });
        await collections.proposals.updateOne(
          { _id: proposalId },
          { $set: { status: "accepted", resolvedAt: new Date() } },
        );
        await i.editReply({
          content: `Congratulations! You are now married!`,
          components: [],
        });
      } else if (i.customId === `marry-no-${proposalKey}`) {
        await collections.proposals.updateOne(
          { _id: proposalId },
          { $set: { status: "rejected", resolvedAt: new Date() } },
        );
        await i.editReply({ content: `Rejected!`, components: [] });
      }
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await collections.proposals.updateOne(
          { _id: proposalId },
          { $set: { status: "expired", resolvedAt: new Date() } },
        );
        await reply
          .edit({
            content: `Nothing was selected! Try again!`,
            components: [],
          })
          .catch(() => {
            return;
          });
      }
    });
  },
};
