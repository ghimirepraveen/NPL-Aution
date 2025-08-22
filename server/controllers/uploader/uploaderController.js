const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");

const awsService = require("../../services/awsService");

const initateUpload = async (req, res, next) => {
  const data = req?.body;
  await awsService
    .initiateUploadFiles(data)
    .then(async (upload) => {
      if (!upload) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.MESSAGE,
          upload
        );
      }
    })
    .catch((e) => next(e));
};

const getS3SignedUrl = async (req, res, next) => {
  const data = req?.body;
  await awsService
    .generatePreSignedUrlForUploadFiles(data)
    .then(async (upload) => {
      if (!upload) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.MESSAGE,
          upload
        );
      }
    })
    .catch((e) => next(e));
};

const completeUploads = async (req, res, next) => {
  const data = req?.body;
  await awsService
    .completeUploadFiles(data)
    .then(async (upload) => {
      if (!upload) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.TITLE,
          CONSTANTS.UPLOAD.UPLOAD_SUCCESS.MESSAGE,
          { path: upload?.Location }
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  initateUpload,
  getS3SignedUrl,
  completeUploads,
};
