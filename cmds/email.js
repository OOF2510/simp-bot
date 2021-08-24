let config = require("../config.json");

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "outlook365",
  auth: {
    user: config.email,
    pass: config.emailPass,
  },
});

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function getSecondPart(str, seperator) {
  return str.split(seperator)[1];
}

var allowedDoms = [
  "outlook.com",
  "gmail.com",
  "simp-bot.xyz",
  "yahoo.net",
  "inbox.com",
  "mail.com",
  "email.com",
  "icloud.com",
  "aol.com",
  "zentool.xyz",
];

module.exports = {
  name: "email",
  aliases: ["e", "mail", "gmail"],
  cat: "misc",
  usage: "email <recipent email> <message>",
  desc: "Sends an email to the specified email address",
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
    if (!args[0])
      return msg.reply(
        `Usage: ${prefix}email <email adress to send to> <message>`
      );

    let recipeint = args.shift().toLowerCase();
    let emailContent = args.join(" ");

    if (!recipeint)
      return msg.reply(
        `Usage: ${prefix}email <email adress to send to> <message>`
      );
    if (!emailContent)
      return msg.reply(
        `Usage: ${prefix}email <email adress to send to> <message>`
      );

    let isEmailValid = validateEmail(recipeint);
    if (!isEmailValid) return msg.reply(`Invalid email!`);

    function sendEmail() {
      var mailOptions = {
        from: config.email,
        to: recipeint,
        subject: `From ${author.username} using Simp Bot on Discord`,
        text: emailContent,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          msg.reply(`Email sent to ${recipeint}`);
        }
      });
    }

    let domain = getSecondPart(recipeint, "@");

    switch (domain) {
      case "outlook.com":
        sendEmail();
        break;
      case "gmail.com":
        sendEmail();
        break;
      case "simp-bot.xyz":
        sendEmail();
        break;
      case "yahoo.net":
        sendEmail();
        break;
      case "inbox.com":
        sendEmail();
        break;
      case "mail.com":
        sendEmail();
        break;
      case "email.com":
        sendEmail();
        break;
      case "icloud.com":
        sendEmail();
        break;
      case "aol.com":
        sendEmail();
        break;
      case "zentool.xyz":
        sendEmail();
        break;

      default:
        msg.reply(
          `To prevent abuse, you can only send emails to addresses with certian domains, here is a list of acceptable email address domains: \`${allowedDoms.join(
            ", "
          )}\`!`
        );
    }
  },
};
