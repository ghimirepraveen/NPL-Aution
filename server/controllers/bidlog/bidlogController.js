const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");
const resHelp = require("../../helpers/responseHelper");
const filterHelp = require("../../helpers/filterHelper");
const bidlogOps = require("../../operations/bidlog/bidlogOps");

const getBidLogListForAdmin = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  await bidlogOps
    .allBidlogs(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.BIDLOG.GET_FAILED.TITLE,
          CONSTANTS.BIDLOG.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.BIDLOG.GET_SUCCESS.TITLE,
          CONSTANTS.BIDLOG.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

const getBidLogListPublic = async (req, res, next) => {
  let filter = filterHelp.manageSortOption(req.query);
  await bidlogOps
    .allBidlogs(filter)
    .then((result) => {
      if (!result) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.BIDLOG.GET_FAILED.TITLE,
          CONSTANTS.BIDLOG.GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.BIDLOG.GET_SUCCESS.TITLE,
          CONSTANTS.BIDLOG.GET_SUCCESS.MESSAGE,
          result
        );
      }
    })
    .catch((e) => next(e));
};

module.exports = {
  getBidLogListForAdmin,
  getBidLogListPublic,
};
