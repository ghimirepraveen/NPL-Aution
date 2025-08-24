const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SiteSettingModel = new Schema({
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  slug: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    default: "site-setting",
  },

  maxBudgetForATeam: {
    type: Number,
    default: 0,
  },

  maxBudgetForACategoryPlayer: {
    type: Number,
    default: 0,
  },

  maxBudgetForBCategoryPlayer: {
    type: Number,
    default: 0,
  },

  maxBudgetForBCategoryPlayer: {
    type: Number,
    default: 0,
  },

  baseBudgetForACategoryPlayer: {
    type: Number,
    default: 0,
  },

  baseBudgetForBCategoryPlayer: {
    type: Number,
    default: 0,
  },

  baseBudgetForCCategoryPlayer: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("SiteSetting", SiteSettingModel);
