const Joi = require("joi");

const idSchema = Joi.object().keys({
  id: Joi.string().required().hex().length(24).messages({
    "string.required": `Id is Required`,
    "string.hex": `Not a valid Id`,
    "string.length": `Not a valid Id`,
  }),
});

const idQuerySchema = Joi.object().keys({
  id: Joi.string().optional().hex().length(24).messages({
    "string.required": `Id is Required`,
    "string.hex": `Not a valid Id`,
    "string.length": `Not a valid Id`,
  }),
});

const listingSchema = Joi.object().keys({
  id: Joi.string().optional().hex().length(24).messages({
    "string.required": `Id is Required`,
    "string.hex": `Not a valid Id`,
    "string.length": `Not a valid Id`,
  }),

  deliveryType: Joi.string()
    .optional()
    .valid("DD", "DB", "BD", "BB")
    .label("deliveryType"),

  page: Joi.number().min(1).optional().label("page"),
  limit: Joi.number().min(1).optional().label("limit"),

  startDate: Joi.date().optional().label("startDate"),
  endDate: Joi.date().optional().label("endDate"),
  states: Joi.string().optional().label("states"),
  search: Joi.string().optional().label("search"),
  sort: Joi.string().optional().label("sort"),
  dir: Joi.string().optional().label("dir"),
  commentType: Joi.string().optional().label("commentType"),

  min: Joi.number().optional().label("min"),
  max: Joi.number().optional().label("max"),
});

const slugSchema = Joi.object().keys({
  slug: Joi.string().required().label("slug"),
});
const changeStatusSchema = Joi.object().keys({
  status: Joi.string().valid("Active", "Blocked").required().label("status"),
});
const buyPlayer = Joi.object().keys({
  player: Joi.string().required().hex().length(24).messages({
    "string.required": `Player ID is Required`,
    "string.hex": `Not a valid Player ID`,
    "string.length": `Not a valid Player ID`,
  }),
});

module.exports = {
  idSchema,
  listingSchema,
  slugSchema,
  idQuerySchema,
  changeStatusSchema,
  buyPlayer,
};
