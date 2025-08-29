const Joi = require("joi");

const siteSetting = Joi.object().keys({
  maxBudgetForATeam: Joi.number().min(0).optional().label("maxBudgetForATeam"),
  maxBudgetForACategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("maxBudgetForACategoryPlayer"),
  maxBudgetForBCategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("maxBudgetForBCategoryPlayer"),
  baseBudgetForACategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("baseBudgetForACategoryPlayer"),
  baseBudgetForBCategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("baseBudgetForBCategoryPlayer"),

  incrementBudgetForCCategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("incrementBudgetForCCategoryPlayer"),
  incrementBudgetForBCategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("incrementBudgetForBCategoryPlayer"),
  incrementBudgetForACategoryPlayer: Joi.number()
    .min(0)
    .optional()
    .label("incrementBudgetForACategoryPlayer"),
});

module.exports = {
  siteSetting,
};
