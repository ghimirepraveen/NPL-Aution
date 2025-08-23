const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

const PlayerOps = require("../../operations/player/playerOp");
const authOps = require("../../operations/auths/authOp");

const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const addPlayer = async (req, res, next) => {
  let data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.Player.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.Player.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.Player.EMAIL_ALREADY_TAKEN.ERRORS
    );
  } else {
    await PlayerOps.createPlayer(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.Player.CREATE_FAILED.TITLE,
            CONSTANTS.Player.CREATE_FAILED.MESSAGE
          );
        } else {
          emailTemplateHelp.sendTemplateMail(
            {
              fullName: result.fullName,
              email: data.email,
            },
            "register"
          );
          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.Player.CREATE_SUCCESS.TITLE,
            CONSTANTS.Player.CREATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

const getPlayerListForAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  filter.createdBy = req?.user?._id;
  await PlayerOps.allPlayers(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.Player.GET_FAILED_LIST.TITLE,
          CONSTANTS.Player.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.Player.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.Player.GET_SUCCESS_LIST.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getPlayerDetail = async (req, res, next) => {
  let id = req?.params?.id;
  await PlayerOps.getPlayerDetailById(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.Player.GET_FAILED.TITLE,
          CONSTANTS.Player.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.Player.GET_SUCCESS.TITLE,
          CONSTANTS.Player.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const updatePlayer = async (req, res, next) => {
  let data = req?.body;
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;
  await PlayerOps.updatePlayerDetailById(id, data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.Player.UPDATE_FAILED.TITLE,
          CONSTANTS.Player.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.Player.UPDATE_SUCCESS.TITLE,
          CONSTANTS.Player.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  addPlayer,
  getPlayerListForAdmin,
  getPlayerDetail,
  updatePlayer,
};
