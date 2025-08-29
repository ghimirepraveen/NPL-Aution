const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const siteSettingCtrl = require("../../controllers/siteSetting/siteSettingController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const siteSettingSchema = require("../../validation/schema/siteSettingSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/for-public")

  /**
   * GET /site-setting/for-public
   * @tags SITESETTINGs
   * @summary Get Details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid input)
   */
  .get(siteSettingCtrl.getSiteSetting);

router
  .route("/")

  /**
   * GET /site-setting
   * @tags SITESETTINGs
   * @security JWT
   * @summary Get list
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(
      commonSchema.listingSchema,
      "Site Setting Listing"
    ),
    Auth,
    checkPermission(["Admin"]),
    siteSettingCtrl.getSiteSettingForAdmin
  )

  /**
   * PUT /site-setting
   * @tags SITESETTINGs
   * @security JWT
   * @summary Update
   * @param {siteSettingRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   *{
   *  "maxBudgetForATeam": 100000,
   *  "maxBudgetForACategoryPlayer": 50000,
   *  "maxBudgetForBCategoryPlayer": 30000,
   *  "baseBudgetForACategoryPlayer": 20000,
   *  "baseBudgetForBCategoryPlayer": 10000,
   *  "incrementBudgetForCCategoryPlayer": 5000,
   *  "incrementBudgetForBCategoryPlayer": 3000,
   *  "incrementBudgetForACategoryPlayer": 2000
   *}
   */

  .put(
    validator.validateRequestBody(
      siteSettingSchema.siteSetting,
      "Site Setting"
    ),
    Auth,
    checkPermission(["Admin"]),

    siteSettingCtrl.addSiteSetting
  );

module.exports = router;
