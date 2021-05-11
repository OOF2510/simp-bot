let config = require("../config.json");

const wildcardMatch = require("wildcard-match");

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
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

var allowedEmails = [
  "outlook.com",
  "gmail.com",
  "simp-bot.xyz",
  "yahoo.net",
  "inbox.com",
  "mail.com",
  "email.com",
  "icloud.com",
  "aol.com",
];

module.exports = {
  name: "email",
  aliases: ["e", "mail", "gmail"],
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
    blDB
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

    if (recipeint.endsWith(allowedEmails[0 || 1])) {
      sendEmail();
    } else if (recipeint.endsWith(allowedEmails[2 || 3])) {
      sendEmail();
    } else if (recipeint.endsWith(allowedEmails[4 || 5])) {
      sendEmail();
    } else if (recipeint.endsWith(allowedEmails[6 || 7])) {
      sendEmail();
    } else if (recipeint.endsWith(allowedEmails[8])) {
      sendEmail();
    } else
      return msg.reply(
        `To prevent abuse, you can only send emails to addresses with certian domains, here is a list of acceptable email address domains: \`${allowedEmails.join(
          ", "
        )}\`!`
      );
  },
};
