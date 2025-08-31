const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const playerCtrl = require("../../controllers/bidlog/bidlogController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/for-public")
  /**
   * GET /bid-log/for-public
   * @tags BIDLOGs
   * @security JWT
   * @summary Get list for superadmin
   * @param {string} player.query - id
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    playerCtrl.getBidLogListPublic
  );

router
  .route("/")
  /**
   * GET /bid-log
   * @tags BIDLOGs
   * @security JWT
   * @summary Get list for superadmin
   * @param {string} player.query - id
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    Auth,
    checkPermission(["Admin"]),
    playerCtrl.getBidLogListForAdmin
  );

module.exports = router;
