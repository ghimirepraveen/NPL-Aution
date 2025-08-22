const fs = require("fs");
const path = require("path");
const emailTemplateOp = require("../operations/emailTemplate/emailTemplateOp");
const mailer = require("../services/mailer");
const tokenHelp = require("../helpers/tokenHelper");

const parseContent = async (emailContent) => {
  const matches = emailContent.content.match(/{{(.+?)}}/g);
  emailContent.appName = process.env.APP_NAME || "Vault";
  if (emailContent.keywords.length > 0) {
    const { keywords } = emailContent;
    keywords.forEach((keyword, i) => {
      const textToReplace = new RegExp(`{{${keyword}}}`, "gi");
      if (keyword === "link") {
        if (emailContent.link !== "") {
          emailContent.content = emailContent.content.replace(
            textToReplace,
            `<a href="${emailContent.link}"` +
              ` style="background:#da2b39;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">` +
              `${emailContent.buttonText}</a>`
          );
        }
      }

      if (keyword === "login") {
        if (emailContent.login !== "") {
          emailContent.content = emailContent.content.replace(
            textToReplace,
            `<a href="${emailContent.link}"` +
              ` style="background:#da2b39;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">` +
              `${emailContent.buttonText}</a>`
          );
        }
      }
      if (keyword === "visit") {
        if (emailContent.login !== "") {
          emailContent.content = emailContent.content.replace(
            textToReplace,
            `<a href="${emailContent.link}"` +
              ` style="background:#da2b39;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">` +
              `${emailContent.buttonText}</a>`
          );
        }
      }

      emailContent.content = emailContent.content.replace(
        textToReplace,
        emailContent[keyword] || ""
      );
    });
  }

  return emailContent.content;
};

const sendTemplateMail = async (data, mailTemplate) => {
  const template = await emailTemplateOp.getEmailTemplateDetails(mailTemplate);
  const emailContent = {};
  emailContent.content = template.content;
  emailContent.keywords = template.keywords;
  const locals = {
    appLogo: process.env.APP_LOGO,
    subject: "",
    content: "",
  };
  switch (mailTemplate) {
    case "email-verification":
      emailContent.fullName = data.fullName;
      emailContent.otp = data.emailVerifyCode;
      locals.content = await parseContent(emailContent);
      locals.subject = template.subject;
      subject = locals.subject || "NBM Travel";
      mailer.sendMail(data.email, subject, locals, template.emailLayout, []);
      break;

    case "forgot-password":
      emailContent.fullName = data.fullName;
      // emailContent.otp = "873847";
      emailContent.otp = data.resetPasswordCode;
      locals.content = await parseContent(emailContent);
      locals.subject = template.subject;
      subject = locals.subject || "NBM Travel";
      mailer.sendMail(data.email, subject, locals, template.emailLayout, []);
      break;

    case "register":
      emailContent.fullName = data.fullName;
      emailContent.otp = data.emailVerifyCode;
      emailContent.pass = data.pass;
      locals.content = await parseContent(emailContent);
      locals.subject = template.subject;
      subject = locals.subject || "NBM Travel";
      mailer.sendMail(data.email, subject, locals, template.emailLayout, []);
      break;
  }
};

module.exports = {
  sendTemplateMail,
};
