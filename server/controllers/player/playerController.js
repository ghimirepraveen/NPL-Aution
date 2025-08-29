const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");
const siteSettingOps = require("../../operations/siteSetting/siteSettingOp");
const playerOps = require("../../operations/player/playerOp");
const authOps = require("../../operations/auths/authOp");
const teamOps = require("../../operations/team/teamOp");

const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const addPlayer = async (req, res, next) => {
  let data = req?.body;
  let user = await playerOps.findPlayerByEmail(data.email);
  if (user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.PLAYER.EMAIL_ALREADY_TAKEN.TITLE,
      CONSTANTS.PLAYER.EMAIL_ALREADY_TAKEN.MESSAGE,
      CONSTANTS.PLAYER.EMAIL_ALREADY_TAKEN.ERRORS
    );
  } else {
    const siteSetting = await siteSettingOps.getSiteSetting();
    // if (siteSetting.maxBudgetForAPlayer === 0) {
    //   resHelp.respondError(
    //     res,
    //     GLOBALVARS.errorStatusCode,
    //     CONSTANTS.PLAYER.CREATE_FAILED.TITLE,
    //     CONSTANTS.PLAYER.CREATE_FAILED.MESSAGE
    //   );
    // }

    if (data.category === "A") {
      data.baseRate = siteSetting?.baseBudgetForACategoryPlayer || 20000;
    } else if (data.category === "B") {
      data.baseRate = siteSetting?.baseBudgetForBCategoryPlayer || 500000;
    } else if (data.category === "C") {
      data.baseRate = siteSetting?.baseBudgetForCCategoryPlayer || 1000000;
    }

    await playerOps
      .createPlayer(data)
      .then((result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.PLAYER.CREATE_FAILED.TITLE,
            CONSTANTS.PLAYER.CREATE_FAILED.MESSAGE
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
            CONSTANTS.PLAYER.CREATE_SUCCESS.TITLE,
            CONSTANTS.PLAYER.CREATE_SUCCESS.MESSAGE,
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
  await playerOps
    .allPlayers(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.PLAYER.GET_FAILED_LIST.TITLE,
          CONSTANTS.PLAYER.GET_FAILED_LIST.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.PLAYER.GET_SUCCESS_LIST.TITLE,
          CONSTANTS.PLAYER.GET_SUCCESS_LIST.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getPlayerDetail = async (req, res, next) => {
  let id = req?.params?.id;
  await playerOps
    .getPlayerDetailById(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.PLAYER.GET_FAILED.TITLE,
          CONSTANTS.PLAYER.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.PLAYER.GET_SUCCESS.TITLE,
          CONSTANTS.PLAYER.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getPlayerListToBuy = async (req, res, next) => {
  await playerOps
    .getListOfPlayer()
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.PLAYER.GET_FAILED.TITLE,
          CONSTANTS.PLAYER.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.PLAYER.GET_SUCCESS.TITLE,
          CONSTANTS.PLAYER.GET_SUCCESS.MESSAGE,
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
  await playerOps
    .updatePlayerDetailById(id, data)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.PLAYER.UPDATE_FAILED.TITLE,
          CONSTANTS.PLAYER.UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.PLAYER.UPDATE_SUCCESS.TITLE,
          CONSTANTS.PLAYER.UPDATE_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const addPlayerToATeam = async (req, res, next) => {
  let data = req?.body; // bidWinner
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;

  const playerData = await playerOps.getPlayerDetailById(id);

  const teamData = await teamOps.getTeamDetailById(data.teamId);
  if (!teamData) {
    return resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.TEAM.GET_FAILED.TITLE,
      CONSTANTS.TEAM.GET_FAILED.MESSAGE
    );
  } else if (teamData.budget < data.finalPrice) {
    return resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.TEAM.BUDGET_EXCEEDED.TITLE,
      CONSTANTS.TEAM.BUDGET_EXCEEDED.MESSAGE
    );
  } else {
    await playerOps
      .updatePlayerDetailById(id, data)
      .then(async (result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.PLAYER.UPDATE_FAILED.TITLE,
            CONSTANTS.PLAYER.UPDATE_FAILED.MESSAGE
          );
        } else {
          const updateTeam = await teamOps.updateTeamDetailById(data.teamId, {
            budget: teamData.budget - data.finalPrice,
            players: [...teamData.players, playerData._id],
            remainingBudget: teamData.remainingBudget - data.finalPrice,
          });

          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.PLAYER.UPDATE_SUCCESS.TITLE,
            CONSTANTS.PLAYER.UPDATE_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

module.exports = {
  addPlayer,
  getPlayerListForAdmin,
  getPlayerDetail,
  updatePlayer,
  addPlayerToATeam,
  getPlayerListToBuy,
};
