const Joi = require("joi");

const updateEmailTemplate = Joi.object().keys({
  subject: Joi.string().required().label("subject"),
  content: Joi.string().required().label("content"),
});

module.exports = {
  updateEmailTemplate,
};
