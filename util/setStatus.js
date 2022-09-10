let lastStatus = require("../temp/lastStatus.json");

module.exports = function (client) {
  if (lastStatus)
    return client.user.setActivity(`${lastStatus.name}`, {
      type: lastStatus.type,
    });
  else
    return client.user.setActivity(
      `${client.guilds.cache.size} servers!`,
      { type: "WATCHING" }
    );
};
