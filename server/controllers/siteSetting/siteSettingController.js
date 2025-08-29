const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");

const siteSettingOps = require("../../operations/siteSetting/siteSettingOp");

const addSiteSetting = async (req, res, next) => {
  let data = req?.body;
  await siteSettingOps
    .updateSiteSettingBySlug("site-setting", data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.SITESETTING.ADD_FAILED.TITLE,
          CONSTANTS.SITESETTING.ADD_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.SITESETTING.ADD_SUCCESS.TITLE,
          CONSTANTS.SITESETTING.ADD_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getSiteSettingForAdmin = async (req, res, next) => {
  await siteSettingOps
    .getSiteSetting("site-setting")
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.SITESETTING.GET_FAILED.TITLE,
          CONSTANTS.SITESETTING.GET_FAILED.MESSAGE
        );
      } else {
        console.log(result);
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.SITESETTING.GET_SUCCESS.TITLE,
          CONSTANTS.SITESETTING.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getSiteSetting = async (req, res, next) => {
  await siteSettingOps
    .getSiteSetting("site-setting")
    .then(async (result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.SITESETTING.GET_FAILED.TITLE,
          CONSTANTS.SITESETTING.GET_FAILED.MESSAGE
        );
      } else {
        console.log(result);
        let newObj = result.toObject();
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.SITESETTING.GET_SUCCESS.TITLE,
          CONSTANTS.SITESETTING.GET_SUCCESS.MESSAGE,
          newObj
        );
      }
    })
    .catch((e) => next(e));
};

const updateSiteSetting = async (req, res, next) => {
  let data = req?.body;
  await siteSettingOps
    .updateSiteSettingBySlug("site-setting", data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.SITESETTING.UPDATE_FAILED.TITLE,
          CONSTANTS.SITESETTING.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.SITESETTING.UPDATE_SUCCESS.TITLE,
          CONSTANTS.SITESETTING.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  addSiteSetting,
  getSiteSettingForAdmin,
  getSiteSetting,
  updateSiteSetting,
};
