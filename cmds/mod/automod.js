const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
} = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Enable or disable AI moderation")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Enable or Disable?")
        .addChoices(
          { name: "Enable", value: "TRUE" },
          { name: "Disable", value: "FALSE" },
        )
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Logging channel")
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
  async execute(interaction, client, config, dbContext, Discord, allowed) {
    let msg = interaction;
    let status = interaction.options.getString("status");
    let channel = interaction.options.getChannel("channel");
    if (channel.type != ChannelType.GuildText)
      return msg.reply({
        content: "Please provie a text channel",
        ephemeral: true,
      });
    let bot = msg.guild.members.cache.get(client.user.id);
    if (
      !bot.permissionsIn(channel).has(PermissionFlagsBits.ViewChannel) ||
      !bot.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)
    )
      return msg.reply({
        content: "I do not have proper permissions in that channel",
        ephemeral: true,
      });

    const collections = dbContext?.automod;
    if (!collections?.automod) {
      return msg.reply({
        content: "Database not ready. Please try again shortly.",
        ephemeral: true,
      });
    }

    await msg.deferReply();

    let limits = {
      sexual: 0.5,
      hate_and_discrimination: 0.5,
      violence_and_threats: 0.5,
      dangerous_and_criminal_content: 0.5,
      selfharm: 0.5,
      health: 0.5,
      financial: 0.5,
      law: 0.5,
      pii: 0.5,
    };

    try {
      await collections.automod.updateOne(
        { serverId: String(msg.guild.id) },
        {
          $set: {
            serverId: String(msg.guild.id),
            status: status === "TRUE",
            channelId: channel.id,
            limits: JSON.stringify(limits),
          },
        },
        { upsert: true },
      );

      let optionsButton = new ButtonBuilder()
        .setLabel("Settings")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`automod|${msg.guild.id}`);

      msg.editReply(
        `AI moderation: ${status === "TRUE" ? "Enabled" : "Disabled"} (logging in ${channel})`,
        { components: [new ActionRowBuilder().addComponents(optionsButton)] }
      );
    } catch (e) {
      msg.editReply({ content: `Error!`, ephemeral: true });
    }
  },
  async handleComponent(interaction, { client, db, collections }) {
    let [action, guildId] = interaction.customId.split("|");
    if (action !== "automod") return;

    const automodSettings = await collections.automod.findOne({ serverId: guildId });
    if (!automodSettings) {
      return interaction.reply({
        content: "Automod is not configured for this server.",
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(`automod|${guildId}`)
      .setTitle("Automod Settings")
      .addLabelComponents([
        {
          label: "Sexual Content Threshold (0 to 1)",
          style: 1,
          customId: "sexual",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).sexual : "0.5",
          required: true,
        },
        {
          label: "Hate and Discrimination Threshold (0 to 1)",
          style: 1,
          customId: "hate_and_discrimination",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).hate_and_discrimination : "0.5",
          required: true,
        },
        {
          label: "Violence and Threats Threshold (0 to 1)",
          style: 1,
          customId: "violence_and_threats",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).violence_and_threats : "0.5",
          required: true,
        },
        {
          label: "Dangerous and Criminal Content Threshold (0 to 1)",
          style: 1,
          customId: "dangerous_and_criminal_content",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).dangerous_and_criminal_content : "0.5",
          required: true,
        },
        {
          label: "Selfharm Threshold (0 to 1)",
          style: 1,
          customId: "selfharm",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).selfharm : "0.5",
          required: true,
        },
        {
          label: "Health Threshold (0 to 1)",
          style: 1,
          customId: "health",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).health : "0.5",
          required: true,
        },
        {
          label: "Financial Threshold (0 to 1)",
          style: 1,
          customId: "financial",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).financial : "0.5",
          required: true,
        },
        {
          label: "Law Threshold (0 to 1)",
          style: 1,
          customId: "law",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).law : "0.5",
          required: true,
        },
        {
          label: "PII Threshold (0 to 1)",
          style: 1,
          customId: "pii",
          placeholder: automodSettings.limits ? JSON.parse(automodSettings.limits).pii : "0.5",
          required: true,
        },
      ]);

    await interaction.showModal(modal);
  },
  async handleModalSubmit(interaction, { client, db, collections }) {
    let [action, guildId] = interaction.customId.split("|");
    if (action !== "automod") return;

    await interaction.deferReply({ ephemeral: true });

    const automodSettings = await collections.automod.findOne({ serverId: guildId });
    if (!automodSettings) {
      return interaction.editReply({
        content: "Automod is not configured for this server.",
        ephemeral: true,
      });
    }

    const newLimits = {};
    const limitFields = [
      "sexual",
      "hate_and_discrimination",
      "violence_and_threats",
      "dangerous_and_criminal_content",
      "selfharm",
      "health",
      "financial",
      "law",
      "pii",
    ];

    for (const field of limitFields) {
      const value = interaction.fields.getTextInputValue(field);
      const numValue = parseFloat(value);

      if (isNaN(numValue) || numValue < 0 || numValue > 1) {
        return interaction.editReply({
          content: `Invalid value for ${field}. Please enter a number between 0 and 1.`, 
          ephemeral: true,
        });
      }
      newLimits[field] = numValue;
    }

    try {
      await collections.automod.updateOne(
        { serverId: guildId },
        { $set: { limits: JSON.stringify(newLimits) } },
        { upsert: true },
      );

      interaction.editReply({ content: "Automod settings updated successfully"});
    } catch (e) {
      console.error(e);
      interaction.editReply({ content: "Error updating automod settings.", ephemeral: true });
    }
  },
};
