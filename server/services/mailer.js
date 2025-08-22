const path = require("path");
const Handlebars = require("hbs");
const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secureConnection: false,
  tls: {
    rejectUnauthorized: false,
  },
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory

const sendMail = async (to, subject, locals, emailLayout, attachments = []) => {
  const compiledTemplate = Handlebars.compile(emailLayout);
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    html: compiledTemplate(locals),
    attachments,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      //error
      console.log("mailerror", { error });
    } else {
      //success
      console.log("success");
    }
  });
};

module.exports = {
  sendMail,
};
