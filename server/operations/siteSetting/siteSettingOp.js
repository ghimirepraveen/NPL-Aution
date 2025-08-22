const siteSettingModel = require("../../models/siteSettingModel");

const createSiteSetting = async (data) => {
  const newSiteSetting = new siteSettingModel(data);
  const result = await newSiteSetting.save();
  return result;
};

const getSiteSetting = async (slug = "site-setting") => {
  const result = await siteSettingModel.findOne({
    slug,
  });
  return result;
};

const getSiteSettingForAdmin = async (slug = "site-setting") => {
  const result = await siteSettingModel.findOne({
    slug,
  });
  return result;
};

const updateSiteSettingBySlug = async (slug = "site-setting", data) => {
  const result = await siteSettingModel
    .findOneAndUpdate({ slug }, data, { upsert: true, new: true })
    .exec();

  return result;
};

const updateSiteSettingById = async (id, data) => {
  const result = await siteSettingModel
    .findByIdAndUpdate(id, data, { upsert: true, new: true })
    .exec();
  return result;
};

module.exports = {
  createSiteSetting,
  getSiteSetting,
  updateSiteSettingBySlug,
  getSiteSettingForAdmin,
  updateSiteSettingById,

  // updateSiteSettingSeoItem
};
