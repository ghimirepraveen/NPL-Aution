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
  category: Joi.string().required().valid("A", "B", "C").label("category"),
  image: Joi.string().optional().label("image"),
});

const updateSchema = Joi.object().keys({
  fullName: Joi.string().required().label("fullName"),
  category: Joi.string().required().valid("A", "B", "C").label("category"),
  contactNumber: Joi.string()
    .pattern(/^(98\d{8}|97\d{8})$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid contact number",
    })
    .label("contactNumber"),
});

module.exports = {
  createSchema,
  updateSchema,
};
