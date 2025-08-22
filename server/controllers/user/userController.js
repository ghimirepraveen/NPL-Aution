const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

// const adminOps = require("../../operations/admin/adminOp");

const authOps = require("../../operations/auths/authOp");

const userOps = require("../../operations/users/userOp");

const crypto = require("crypto");
const SALT = process.env.PASSWORD_SALT;
const ITERATIONS = parseInt(process.env.PASSWORD_ITERATIONS);
const KEYLEN = parseInt(process.env.PASSWORD_KEYLEN);
const ALGORITHM = process.env.PASSWORD_ALGORITHM;
const HASHTYPE = process.env.PASSWORD_HASHTYPE;
const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const addUser = async (req, res, next) => {
  let data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.ERRORS
    );
  } else {
    let hashPass = crypto.pbkdf2Sync(
      data.password,
      SALT,
      ITERATIONS,
      KEYLEN,
      ALGORITHM
    );

    data.password = hashPass.toString(HASHTYPE);
    data.userType = "User";
    data.isEmailVerified = false;
    data.emailVerifyCode = await Math.floor(100000 + Math.random() * 900000);
    await userOps
      .createUser(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.USER.CREATE_FAILED.TITLE,
            CONSTANTS.USER.CREATE_FAILED.MESSAGE
          );
        } else {
          emailTemplateHelp.sendTemplateMail(
            {
              fullName: result.fullName,
              email: data.email,
              // pass: pass,
              emailVerifyCode: result.emailVerifyCode,
            },
            "email-verification"
          );

          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.USER.CREATE_SUCCESS.TITLE,
            CONSTANTS.USER.CREATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

const addUserByAdmin = async (req, res, next) => {
  let data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.USER.EMAIL_ALREADY_TAKEN.ERRORS
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
    data.userType = "User";
    data.isEmailVerified = true;
    data.createdBy = req?.user?._id;

    data.emailVerifyCode = await Math.floor(100000 + Math.random() * 900000);
    await userOps
      .createUser(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.USER.CREATE_FAILED.TITLE,
            CONSTANTS.USER.CREATE_FAILED.MESSAGE
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
            CONSTANTS.USER.CREATE_SUCCESS.TITLE,
            CONSTANTS.USER.CREATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

const getUserListForAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req?.query);

  // filter.createdBy = req?.user?._id;

  await userOps
    .AllUsers(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.USER.GET_FAILED_LIST.TITLE,
          CONSTANTS.USER.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.USER.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.USER.GET_SUCCESS_LIST.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getDonorListForPublic = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req?.query);
  await userOps
    .AllDonorForPublic(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.USER.DONNER_FAILED.TITLE,
          CONSTANTS.USER.DONNER_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.USER.DONNER_SUCCESS.TITLE,
          CONSTANTS.USER.DONNER_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getDonorListForUser = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req?.query);
  console.log(filter);
  await userOps
    .AllDonorForUser(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.USER.DONNER_FAILED.TITLE,
          CONSTANTS.USER.DONNER_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.USER.DONNER_SUCCESS.TITLE,
          CONSTANTS.USER.DONNER_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getUserDetail = async (req, res, next) => {
  let id = req?.params?.id;

  await userOps
    .getUserDetails(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.USER.GET_FAILED.TITLE,
          CONSTANTS.USER.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.USER.GET_SUCCESS.TITLE,
          CONSTANTS.USER.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const updateUser = async (req, res, next) => {
  let data = req?.body;
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;
  await userOps
    .updateUserDetails(id, data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.USER.UPDATE_FAILED.TITLE,
          CONSTANTS.USER.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.USER.UPDATE_SUCCESS.TITLE,
          CONSTANTS.USER.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  addUser,
  getUserListForAdmin,
  getUserDetail,
  updateUser,
  addUserByAdmin,
  getDonorListForPublic,
  getDonorListForUser,
};
