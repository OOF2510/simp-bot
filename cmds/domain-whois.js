const whois = require("whois-light");

function checkDomain(domain) {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return regex.test(domain);
}

module.exports = {
  name: "domain-whois",
  aliases: [
    "whoisdomain",
    "dwhois",
    "dwi",
    "wid",
    "domainwhois",
    "domain",
    "whoisd",
    "domainwi",
    "widomain",
  ],
  cat: "info",
  usage: "domain-whois <domain>",
  desc: "Gets info about a domain",
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
    wcDB
  ) {
    try {
    if (!args[0]) return msg.reply(`Usage: \`${prefix}${this.usage}\``);
    let domain = args[0];
    if (!checkDomain(domain)) return msg.reply("That is not a valid domain!");
    let tld = domain.split(".")[1];

    let domainInfo = await whois.lookup({ format: true }, domain);

    let domainName = domainInfo["Domain Name"];
    let regDomainID = domainInfo["Registry Domain ID"];
    let registrar = domainInfo["Registrar"];
    let lastUpdated = domainInfo["Updated Date"];
    let registered = domainInfo["Creation Date"];
    let expiryDate = domainInfo["Registry Expiry Date"];
    let abuseEmail = domainInfo["Registrar Abuse Contact Email"];
    let regOrg = domainInfo["Registrant Organization"];

    let widEm = new Discord.MessageEmbed()
      .setTitle(`Domain info for ${domainName}`)
      .setColor(config.embedColor)
      .addFields(
        { name: `Registry Domain ID`, value: `${regDomainID}`, inline: true },
        { name: `Registrar`, value: `${registrar}`, inline: true },
        { name: `Last Updated`, value: `${lastUpdated}`, inline: true },
        { name: `Registered`, value: `${registered}`, inline: true },
        { name: `Expiry Date`, value: `${expiryDate}`, inline: true },
        { name: `Registrar Abuse Email`, value: `${abuseEmail}`, inline: true },
        { name: `Registrant Organization`, value: `${regOrg}`, inline: true }
      )
      .setTimestamp();

    channel.send({ embeds: [widEm] });
      } catch (error) {
        let message = `Error executing: ||\`${error}\`||`
        if (message.length > 2000) return msg.reply(`Error executing`)
        msg.reply(message)
        }
  },
};
