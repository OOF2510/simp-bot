let lastStatus = require("../temp/lastStatus.json");
let { ActivityType, Client } = require("discord.js");

/**
 * Sets the status of the bot
 * @param {Client} client
 * @returns
 */
module.exports = function (client) {
  if (lastStatus)
    return client.user.setActivity(`${lastStatus.name}`, {
      type: lastStatus.type,
    });
  else
    return client.user.setActivity(`${client.guilds.cache.size} servers!`, {
      type: ActivityType.Watching,
    });
};
