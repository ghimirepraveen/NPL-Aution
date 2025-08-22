const fileHelp = require("../../helpers/fileUploadHelper");
const resHelp = require("../../helpers/responseHelper");

const BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_S3_PROJECT_NAME = process.env.AWS_S3_PROJECT_NAME;

const uploadeFile = async (req, res, next) => {
  const result = fileHelp
    .uploadMulter(req, res, next)
    .then((imageName, err) => {
      if (err) {
        resHelp.respondError(res, 422, "", "Error On Upload");
      }
      return {
        path: `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${AWS_S3_PROJECT_NAME}/${req.query.folder}/${imageName}`,
      };
      // return { path: `${req.query.folder}/${imageName}` };
    });
  return result;
};

const uploadeFileForForm = async (req, res, next, file) => {
  const result = fileHelp
    .uploadMulterForm(req, res, next, file)
    .then((imageName, err) => {
      if (err) {
        resHelp.respondError(res, 422, "", "Error On Upload");
      }
      return {
        path: `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${AWS_S3_PROJECT_NAME}/${req.query.folder}/${imageName}`,
      };
      // return { path: `${req.query.folder}/${imageName}` };
    });
  return result;
};

module.exports = {
  uploadeFile,
  uploadeFileForForm,
};
