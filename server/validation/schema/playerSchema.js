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
  playingStyle: Joi.string()
    .valid("Batsman", "Bowler", "All-Rounder", "Wicket-Keeper")
    .optional()
    .label("playingStyle"),
  battingStyle: Joi.string()
    .valid("Right-Handed", "Left-Handed")
    .optional()
    .label("battingStyle"),
  bowlingStyle: Joi.string()
    .valid("Right-Arm", "Left-Arm")
    .optional()
    .label("bowlingStyle"),
  bowlingType: Joi.string()
    .valid("Pace", "Spin")
    .optional()
    .label("bowlingType"),
  stats: Joi.object({
    matches: Joi.number().min(0).default(0),
    runs: Joi.number().min(0).default(0),
    wickets: Joi.number().min(0).default(0),
    catches: Joi.number().min(0).default(0),
  })
    .optional()
    .label("stats"),
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
  playingStyle: Joi.string()
    .valid("Batsman", "Bowler", "All-Rounder", "Wicket-Keeper")
    .optional()
    .label("playingStyle"),
  battingStyle: Joi.string()
    .valid("Right-Handed", "Left-Handed")
    .optional()
    .label("battingStyle"),
  bowlingStyle: Joi.string()
    .valid("Right-Arm", "Left-Arm")
    .optional()
    .label("bowlingStyle"),
  bowlingType: Joi.string()
    .valid("Pace", "Spin")
    .optional()
    .label("bowlingType"),
  stats: Joi.object({
    matches: Joi.number().min(0).default(0),
    runs: Joi.number().min(0).default(0),
    wickets: Joi.number().min(0).default(0),
    catches: Joi.number().min(0).default(0),
  })
    .optional()
    .label("stats"),
});

module.exports = {
  createSchema,
  updateSchema,
};
