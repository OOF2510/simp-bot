const { SlashCommandBuilder } = require("discord.js");
const translate = require("translate-google");
const { CommandInteraction, Client } = require("discord.js"),
  Sequelize = require("sequelize");
//https://github.com/shikar/NODE_GOOGLE_TRANSLATE/blob/master/languages.js
const langs = {
  auto: "Automatic",
  af: "Afrikaans",
  sq: "Albanian",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese Simplified",
  "zh-tw": "Chinese Traditional",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  iw: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ma: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sudanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu",
};
function getCode(desiredLang) {
  if (!desiredLang) {
    return false;
  }
  desiredLang = desiredLang.toLowerCase();
  if (langs[desiredLang]) {
    return desiredLang;
  }
  var keys = Object.keys(langs).filter((key) => {
    if (typeof langs[key] !== "string") {
      return false;
    }
    return langs[key].toLowerCase() === desiredLang;
  });
  return keys[0] || false;
}

function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}
// ------------------------------------------------------
module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate-message")
    .setDescription("Translate a message between two languages")
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription("ID of message to translate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("result-lang")
        .setDescription("Language to translate to")
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
  async execute(interaction, client, config, db, Discord, allowed) {
    let msg = interaction;
    let mesID = interaction.options.getString("message-id");
    let resLang = interaction.options.getString("result-lang");
    if (isNaN(Number(mesID))) return msg.reply({ content: `It doesn't seem like that's a message ID, try again!`, ephemeral: true })
    if (mesID.length < 18 || mesID > 9223372036854775807) return msg.reply({ content: `It doesn't seem like that's a message ID, try again!`, ephemeral: true })
    let mes = await msg.channel.messages.fetch(mesID);
    if (!mes)
      return msg.reply({
        content:
          "Could not get that message, make sure it's in the same channel as the one you're using this command in!",
        ephemeral: true,
      });
    let text = mes.content;

    let langstring = JSON.stringify(langs);

    if (!isSupported(resLang))
      return msg.reply({
        content: `Please use a supported language code:\n\`${langstring.replaceAll(
          ",",
          `\n`
        )}\``,
        ephemeral: true,
      });

    await msg.deferReply();
    try {
      let result = await translate(text, { to: resLang });
      msg.editReply(`${result}`);
    } catch (e) {
      msg.editReply({ content: `Error, try again!`, ephemeral: true });
    }
  },
};
