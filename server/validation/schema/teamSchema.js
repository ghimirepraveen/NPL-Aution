const Joi = require("joi");

const createSchema = Joi.object().keys({
  fullName: Joi.string().required().label("fullName"),
  email: Joi.string().email().required().label("email"),
  contactNumber: Joi.string()
    .pattern(/^(98\d{8}|97\d{8})$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid contact number",
    })
    .label("contactNumber"),
  image: Joi.string().optional().label("image"),
});

const updateSchema = Joi.object().keys({
  fullName: Joi.string().required().label("fullName"),
  contactNumber: Joi.string()
    .pattern(/^(98\d{8}|97\d{8})$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid contact number",
    })
    .label("contactNumber"),
  image: Joi.string().optional().label("image"),
});

module.exports = {
  createSchema,
  updateSchema,
};
