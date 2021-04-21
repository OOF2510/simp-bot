const OAuthClient = require("disco-oauth");
const config = require("../../config.json");

const client = new OAuthClient(config.clientID, config.clientSecret);
client.setRedirect(config.dashboardURL);
client.setScopes("identify", "guilds");

module.exports = client;
