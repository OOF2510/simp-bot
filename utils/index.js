const fs = require("fs");

function getCommands() {
  let value = [];

  const cmdFiles = fs
    .readdirSync("./cmds")
    .filter((file) => file.endsWith(".js"));

  cmdFiles.forEach((cmd) => {
    const file = require(`../cmds/${cmd}`);

    value.push({
      name: file.name ? file.name : `No command name`,
      aliases: file.aliases ? file.aliases : "No aliases",
    });
  });
  return value
}

module.exports = { getCommands };
