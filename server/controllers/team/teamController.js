const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");

const teamOps = require("../../operations/team/teamOp");
const authOps = require("../../operations/auths/authOp");
const siteSettingOps = require("../../operations/siteSetting/siteSettingOp");
const crypto = require("crypto");
const SALT = process.env.PASSWORD_SALT;
const ITERATIONS = parseInt(process.env.PASSWORD_ITERATIONS);
const KEYLEN = parseInt(process.env.PASSWORD_KEYLEN);
const ALGORITHM = process.env.PASSWORD_ALGORITHM;
const HASHTYPE = process.env.PASSWORD_HASHTYPE;
const emailTemplateHelp = require("../../helpers/emailTemplateHelper");
const playerOps = require("../../operations/player/playerOp");

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

    const siteSetting = await siteSettingOps.getSiteSetting();
    // if (siteSetting?.maxBudgetForATeam === 0) {
    //   resHelp.respondError(
    //     res,
    //     GLOBALVARS.errorStatusCode,
    //     CONSTANTS.TEAM.CREATE_FAILED.TITLE,
    //     CONSTANTS.TEAM.CREATE_FAILED.MESSAGE
    //   );
    // } else {

    data.budget = siteSetting?.maxBudgetForATeam || 100000;
    data.remainingBudget = siteSetting?.maxBudgetForATeam || 100000;
    await teamOps
      .createTeam(data)
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
//};

const getTeamListForAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  filter.createdBy = req?.user?._id;
  await teamOps
    .allTeams(filter)
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
  await teamOps
    .getTeamDetailById(id)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.TEAM.GET_FAILED.TITLE,
          CONSTANTS.TEAM.GET_FAILED.MESSAGE
        );
      } else {
        console.log("Team details fetched successfully");
        console.log(result);
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
  await teamOps
    .updateTeamDetailById(id, data)
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

const buyPlayerManually = async (req, res, next) => {
  let data = req?.body;
  let id = req?.params?.id;
  data.updatedBy = req?.user?._id;

  const siteSetting = await siteSettingOps.getSiteSetting();

  if (req?.body?.player) {
    data.$push = { player: req.body.player };
  }

  const playerData = await playerOps.getPlayerDetailById(req?.body?.player);

  const teamData = await teamOps.getTeamDetailById(id);

  let buyingPrice;

  if (playerData.category === "A") {
    buyingPrice = siteSetting?.maxBudgetForACategoryPlayer;
  } else if (playerData.category === "B") {
    buyingPrice = siteSetting?.maxBudgetForBCategoryPlayer;
  } else if (playerData.category === "C") {
    buyingPrice = siteSetting?.maxBudgetForCCategoryPlayer;
  }

  if (!teamData) {
    return resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.TEAM.GET_FAILED.TITLE,
      CONSTANTS.TEAM.GET_FAILED.MESSAGE
    );
  } else if (teamData?.remainingBudget < (playerData?.currentBid || 0)) {
    return resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.TEAM.BUY_PLAYER_FAILED.TITLE,
      CONSTANTS.TEAM.BUY_PLAYER_FAILED.MESSAGE
    );
  } else {
    await teamOps
      .updateTeamDetailById(id, data)
      .then(async (result) => {
        if (!result) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.TEAM.BUY_PLAYER_FAILED.TITLE,
            CONSTANTS.TEAM.BUY_PLAYER_FAILED.MESSAGE
          );
        } else {
          await playerOps.updatePlayerDetailById(req?.body?.player, {
            bidWinner: id,
            isBidded: true,
            currentBid: buyingPrice,
          });

          await teamOps.updateTeamDetailById(id, {
            $inc: { remainingBudget: -buyingPrice || 0 },
          });

          await bidlogOps.createBidlog({
            player: req?.body?.player,
            team: id,
            price: buyingPrice,
            boughtBy: req?.user?._id,
            increasedAmount: buyingPrice - (playerData.currentBid || 0),
            message: `Player ${playerData.fullName} bought for ${buyingPrice} by team ${teamData.fullName}`,
          });

          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.TEAM.BUY_PLAYER_SUCCESS.TITLE,
            CONSTANTS.TEAM.BUY_PLAYER_SUCCESS.MESSAGE,
            result
          );
        }
      })
      .catch((e) => next(e));
  }
};

module.exports = {
  addTeam,
  getTeamListForAdmin,
  getTeamDetail,
  updateTeam,
  buyPlayerManually,
};
