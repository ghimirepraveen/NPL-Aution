const Joi = require("joi");

const emailRequest = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { valid: true } })
    .required()
    .lowercase()
    .label("email"),
});

const loginRequest = Joi.object()
  .keys({
    email: Joi.string()
      .email({ tlds: { valid: true } })
      .required()
      .lowercase()
      .label("email"),
    password: Joi.string().required().min(4).label("password."),
    userType: Joi.string().optional().valid("Rider").label("userType"),
  })
  .options({ stripUnknown: true });

const updatePassword = Joi.object().keys({
  currentPassword: Joi.string().required().label("currentPassword"),
  newPassword: Joi.string().required().label("newPassword"),
});

const emailWithCode = Joi.object().keys({
  code: Joi.string().required().label("code"),
  email: Joi.string()
    .email({ tlds: { valid: true } })
    .required()
    .lowercase()
    .label("email"),
});

const updatePasswordWithCode = Joi.object().keys({
  code: Joi.string().required().label("code"),
  email: Joi.string()
    .email({ tlds: { valid: true } })
    .required()
    .lowercase()
    .label("email"),
  password: Joi.string().required().label("password"),
});

const profileSchema = Joi.object().keys({
  image: Joi.string().optional().allow("").label("image"),
  fullName: Joi.string().optional().label("fullName"),
});

const logout = Joi.object().keys({
  refreshToken: Joi.string().optional().allow("").label("refreshToken"),
});

const tokenSchema = Joi.object().keys({
  token: Joi.string().required().label("token"),
});

const changeStatus = Joi.object().keys({
  status: Joi.string().required().label("status"),
  _id: Joi.string()
    .required()
    .hex()
    .length(24)
    .messages({
      "string.required": `Id is Required`,
      "string.hex": `Not a valid Id`,
      "string.length": `Not a valid Id`,
    })
    .label("_id"),
});
module.exports = {
  emailRequest,
  loginRequest,
  emailWithCode,
  updatePasswordWithCode,

  changeStatus,
  updatePassword,
  logout,
  tokenSchema,
  profileSchema,
};
