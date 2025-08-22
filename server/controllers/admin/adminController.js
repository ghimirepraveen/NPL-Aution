const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

const adminOps = require("../../operations/admin/adminOp");
const authOps = require("../../operations/auths/authOp");

const userOps = require("../../operations/users/userOp");

const crypto = require("crypto");
const SALT = process.env.PASSWORD_SALT;
const ITERATIONS = parseInt(process.env.PASSWORD_ITERATIONS);
const KEYLEN = parseInt(process.env.PASSWORD_KEYLEN);
const ALGORITHM = process.env.PASSWORD_ALGORITHM;
const HASHTYPE = process.env.PASSWORD_HASHTYPE;
const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const addAdmin = async (req, res, next) => {
  let data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.ADMIN.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.ADMIN.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.ADMIN.EMAIL_ALREADY_TAKEN.ERRORS
    );
  } else {
    let alphabetArray = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTWXYZ";
    let numericArray = "123456789";
    let pass =
      alphabetArray[Math.floor(Math.random() * alphabetArray.length)] +
      Math.random().toString(36).substring(2, 7) +
      "@N" +
      numericArray[Math.floor(Math.random() * numericArray.length)];

    let hashPass = crypto.pbkdf2Sync(pass, SALT, ITERATIONS, KEYLEN, ALGORITHM);
    data.password = hashPass.toString(HASHTYPE);
    data.userType = "Admin";
    data.isEmailVerified = true;

    // data.createdBy = req?.user?._id;
    data.emailVerifyCode = await Math.floor(100000 + Math.random() * 900000);
    await adminOps
      .createAdmin(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.ADMIN.CREATE_FAILED.TITLE,
            CONSTANTS.ADMIN.CREATE_FAILED.MESSAGE
          );
        } else {
          emailTemplateHelp.sendTemplateMail(
            {
              fullName: result.fullName,
              email: data.email,
              pass: pass,
              emailVerifyCode: result.emailVerifyCode,
            },
            "register"
          );
          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.ADMIN.CREATE_SUCCESS.TITLE,
            CONSTANTS.ADMIN.CREATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

const getAdminListForSuperAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  filter.createdBy = req?.user?._id;
  await adminOps
    .allAdmins(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.ADMIN.GET_FAILED_LIST.TITLE,
          CONSTANTS.ADMIN.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.ADMIN.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.ADMIN.GET_SUCCESS_LIST.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getAdminDetail = async (req, res, next) => {
  let id = req?.params?.id;
  await adminOps
    .getAdminDetailById(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.ADMIN.GET_FAILED.TITLE,
          CONSTANTS.ADMIN.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.ADMIN.GET_SUCCESS.TITLE,
          CONSTANTS.ADMIN.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const updateAdmin = async (req, res, next) => {
  let data = req?.body;
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;
  await adminOps
    .updateAdminDetailById(id, data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.ADMIN.UPDATE_FAILED.TITLE,
          CONSTANTS.ADMIN.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.ADMIN.UPDATE_SUCCESS.TITLE,
          CONSTANTS.ADMIN.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  addAdmin,
  getAdminListForSuperAdmin,
  getAdminDetail,
  updateAdmin,
};
