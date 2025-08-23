const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

const TeamOps = require("../../operations/team/teamOp");
const authOps = require("../../operations/auths/authOp");

const crypto = require("crypto");
const SALT = process.env.PASSWORD_SALT;
const ITERATIONS = parseInt(process.env.PASSWORD_ITERATIONS);
const KEYLEN = parseInt(process.env.PASSWORD_KEYLEN);
const ALGORITHM = process.env.PASSWORD_ALGORITHM;
const HASHTYPE = process.env.PASSWORD_HASHTYPE;
const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const addTeam = async (req, res, next) => {
  let data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.TEAM.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.TEAM.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.TEAM.EMAIL_ALREADY_TAKEN.ERRORS
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
    data.userType = "Team";
    data.isEmailVerified = true;

    data.emailVerifyCode = await Math.floor(100000 + Math.random() * 900000);
    await TeamOps.createTeam(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.TEAM.CREATE_FAILED.TITLE,
            CONSTANTS.TEAM.CREATE_FAILED.MESSAGE
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
            CONSTANTS.TEAM.CREATE_SUCCESS.TITLE,
            CONSTANTS.TEAM.CREATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

const getTeamListForAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  filter.createdBy = req?.user?._id;
  await TeamOps.allTeams(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.TEAM.GET_FAILED_LIST.TITLE,
          CONSTANTS.TEAM.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.TEAM.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.TEAM.GET_SUCCESS_LIST.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getTeamDetail = async (req, res, next) => {
  let id = req?.params?.id;
  await TeamOps.getTeamDetailById(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.TEAM.GET_FAILED.TITLE,
          CONSTANTS.TEAM.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.TEAM.GET_SUCCESS.TITLE,
          CONSTANTS.TEAM.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const updateTeam = async (req, res, next) => {
  let data = req?.body;
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;
  await TeamOps.updateTeamDetailById(id, data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.TEAM.UPDATE_FAILED.TITLE,
          CONSTANTS.TEAM.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.TEAM.UPDATE_SUCCESS.TITLE,
          CONSTANTS.TEAM.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  addTeam,
  getTeamListForAdmin,
  getTeamDetail,
  updateTeam,
};
