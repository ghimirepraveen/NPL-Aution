const EmailTemplate = require("../../models/emailTemplateModel");

const getAllEmailTemplate = async (filter) => {
  const result = await EmailTemplate.listAllEmailTemplates(filter);
  return result;
};

const getEmailTemplateDetails = async (slug) => {
  const result = await EmailTemplate.findOne({ slug });
  return result;
};

const updateEmailTemplateDetails = async (slug, data) => {
  const result = await EmailTemplate.findOneAndUpdate({ slug }, data, {
    upsert: true,
    new: true,
  });
  return result;
};

module.exports = {
  getAllEmailTemplate,
  getEmailTemplateDetails,
  updateEmailTemplateDetails,
};
