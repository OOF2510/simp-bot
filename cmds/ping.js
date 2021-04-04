module.exports = {
  name: "ping",
  aliases: ["p"],
  execute(msg, args, client) {
    msg.reply(`Pong, UwU! (${client.ws.ping}ms)`);
  },
};
