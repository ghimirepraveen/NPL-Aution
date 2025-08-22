const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

const emailTemplateOps = require("../../operations/emailTemplate/emailTemplateOp");

const AllEmailTemplates = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  await emailTemplateOps
    .getAllEmailTemplate(filter)
    .then(async (email) => {
      if (!email) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.EMAIL.GET_FAILED_LIST.TITLE,
          CONSTANTS.EMAIL.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.EMAIL.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.EMAIL.GET_SUCCESS_LIST.MESSAGE,
          email
        );
      }
    })
    .catch((e) => next(e));
};

const getEmailTemplateDetailsWithSlug = async (req, res, next) => {
  const slug = req?.params?.slug;
  await emailTemplateOps
    .getEmailTemplateDetails(slug)
    .then(async (email) => {
      if (!email) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.EMAIL.GET_FAILED.TITLE,
          CONSTANTS.EMAIL.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.EMAIL.GET_SUCCESS.TITLE,
          CONSTANTS.EMAIL.GET_SUCCESS.MESSAGE,
          email
        );
      }
    })
    .catch((e) => next(e));
};

const updateEmailTemplateWithSlug = async (req, res, next) => {
  const slug = req?.params?.slug;
  const data = req?.body;
  await emailTemplateOps
    .updateEmailTemplateDetails(slug, data)
    .then(async (email) => {
      if (!email) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.EMAIL.UPDATE_FAILED.TITLE,
          CONSTANTS.EMAIL.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.EMAIL.UPDATE_SUCCESS.TITLE,
          CONSTANTS.EMAIL.UPDATE_SUCCESS.MESSAGE
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  AllEmailTemplates,
  getEmailTemplateDetailsWithSlug,
  updateEmailTemplateWithSlug,
};
