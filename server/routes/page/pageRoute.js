const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const pageCtrl = require("../../controllers/page/pageController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schemas/commonSchema");
const pageSchema = require("../../validation/schemas/pageSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/")

  /**
   * GET /page
   * @tags PAGEs
   * @security JWT
   * @summary Get list
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "Page Listing"),
    Auth,
    checkPermission(["Admin"]),
    pageCtrl.getPageList
  );

router
  .route("/:slug")

  /**
   * GET /page/{slug}
   * @tags PAGEs
   * @security JWT
   * @summary Get Details
   * @param {string} slug.path - slug (terms-and-conditions)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid input)
   */
  .get(
    validator.validateRequestParams(commonSchema.slugSchema, "Page"),
    pageCtrl.getPageDetail
  )
  /**
   * @typedef {object} UpdatePageModel
   * @property {string} title  - title
   * @property {string} content  - content
   */

  /**
   * PUT /page/{slug}
   * @tags PAGEs
   * @security JWT
   * @summary Update
   * @param {string} slug.path - slug (terms-and-conditions)
   * @param {UpdatePageModel} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .put(
    validator.validateRequestParams(commonSchema.slugSchema, "Page"),
    validator.validateRequestBody(pageSchema.updatePage, "Page"),
    Auth,
    checkPermission(["Admin"]),

    pageCtrl.updatePage
  );

module.exports = router;
