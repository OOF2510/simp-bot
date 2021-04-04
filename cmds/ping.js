module.exports = {
  name: "ping",
  execute(msg, args, client) {
    msg.reply(`Pong, UwU! (${client.ws.ping}ms)`);
  },
};
