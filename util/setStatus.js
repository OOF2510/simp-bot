const fs = require("fs");

module.exports = function (client) {
  if (fs.existsSync("./temp/lastStatus.json")) {
    let lastStatus = require("./temp/lastStatus.json");
    return client.user.setActivity(`${lastStatus.name}`, {
      type: lastStatus.type,
    });
  }
  return client.user.setActivity(
    `${client.guilds.cache.size} servers! | ${config.prefix}help`,
    { type: "WATCHING" }
  );
};
