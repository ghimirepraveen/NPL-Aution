const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const faqCtrl = require("../../controllers/faq/faqController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schemas/commonSchema");
const faqSchema = require("../../validation/schemas/faqSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/for-public")

  /**
   * GET /faq/for-public
   * @tags FAQs
   * @security JWT
   * @summary Get Details
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.listingSchema, "FAQ"),
    faqCtrl.getFAQListForPublic
  );

router
  .route("/")

  /**
   * GET /faq
   * @tags FAQs
   * @security JWT
   * @summary Get list for
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   *
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "FAQs"),
    Auth,
    checkPermission(["Admin"]),
    faqCtrl.getFAQListForAdmin
  )

  /**
   * POST /faq
   * @tags FAQs
   * @security JWT
   * @summary Create
   * @param {object} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   * {
   *   "title": "Technology Updates",
   *   "priority": 1,
   *   "content": "Latest trends and updates in technology.",
   *  "isPublished":true
   * }
   *
   */
  .post(
    validator.validateRequestBody(faqSchema.FAQ, "FAQ"),
    Auth,
    checkPermission(["Admin"]),
    faqCtrl.addFAQ
  );

router
  .route("/:id")

  /**
   * GET /faq/{id}
   * @tags FAQs
   * @security JWT
   * @summary Get Details
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.idSchema, "FAQ"),
    Auth,
    checkPermission(["Admin"]),
    faqCtrl.getFAQDetail
  )

  /**
   * PUT /faq/{id}
   * @tags FAQs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {object} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   * {
   *   "title": "Technology Updates",
   *   "priority": 1,
   *   "content": "Latest trends and updates in technology.",
   *    "isPublished":true
   * }
   *
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "FAQ"),
    validator.validateRequestBody(faqSchema.FAQ, "FAQ"),
    Auth,
    checkPermission(["Admin"]),
    faqCtrl.updateFAQ
  );

module.exports = router;
