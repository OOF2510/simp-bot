const math = require("mathjs");

module.exports = {
  name: "math",
  aliases: ["maths", "m", "calucate", "calculator"],
  cat: "misc",
  usage: "math <operation> <num1> <num2>",
  desc: "Does specified math equation",
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
    db
  ) {
    switch (args[0]) {
      case "add":
        msg.channel.send(math.add(args[1], args[2]));
        break;
      case "subtract":
        msg.channel.send(math.subtract(args[1], args[2]));
        break;
      case "multiply":
        msg.channel.send(math.multiply(args[1], args[2]));
        break;
      case "divide":
        msg.channel.send(math.divide(args[1], args[2]));
        break;
      case "pow":
        msg.channel.send(math.pow(args[1], args[2]));
        break;
      case "sqrt":
        msg.channel.send(math.sqrt(args[1]));
        break;
      case "factorial":
        msg.channel.send(math.factorial(args[1]));
        break;
      case "abs":
        msg.channel.send(math.abs(args[1]));
        break;
      case "ceil":
        msg.channel.send(math.ceil(args[1]));
        break;
      case "floor":
        msg.channel.send(math.floor(args[1]));
        break;
      case "round":
        msg.channel.send(math.round(args[1]));
        break;
      case "random":
        msg.channel.send(math.random(args[1], args[2]));
        break;
      case "pi":
        msg.channel.send(math.pi);
        break;
      case "e":
        msg.channel.send(math.e);
        break;
      case "sin":
        msg.channel.send(math.sin(args[1]));
        break;
      case "cos":
        msg.channel.send(math.cos(args[1]));
        break;
      case "tan":
        msg.channel.send(math.tan(args[1]));
        break;
      case "asin":
        msg.channel.send(math.asin(args[1]));
        break;
      case "acos":
        msg.channel.send(math.acos(args[1]));
        break;
      case "atan":
        msg.channel.send(math.atan(args[1]));
        break;
      case "log":
        msg.channel.send(math.log(args[1]));
        break;
      default:
        msg.channel.send(
          "Invalid math operation (valid operations: `add, subtract, multiply, divide, pow, sqrt, factorial, abs, ciel, floor, round, random, pi, e, sin, cos, tan, asin, acos, atan, log`"
        );
        break;
    }
  },
};
