const express = require("express");
const router = express.Router();

const emailtemplateCtrl = require("../../controllers/emailTemplate/emailTemplateController");
const validator = require("../../validation/validator");
const emailTemplateSchema = require("../../validation/schemas/emailTemplateSchema");
const commonSchema = require("../../validation/schemas/commonSchema");
const { Auth } = require("../../middlewares/Auth");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/")

  /**
   * GET /email-template
   * @tags EMIAL-TEMPLATEs
   * @security JWT
   * @summary  Get all email templates
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */

  .get(
    validator.validateRequestQuery(
      commonSchema.listingSchema,
      "Email Template Listing"
    ),
    Auth,
    checkPermission(["SuperAdmin"]),
    emailtemplateCtrl.AllEmailTemplates
  );

router
  .route("/:slug")

  /**
   * GET /email-template/{slug}
   * @tags EMIAL-TEMPLATEs
   * @security JWT
   * @summary Get Details
   * @param {string} slug.path - slug (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid slug)
   */
  .get(
    validator.validateRequestParams(
      commonSchema.slugSchema,
      "Get Email Template"
    ),
    Auth,
    checkPermission(["SuperAdmin"]),
    emailtemplateCtrl.getEmailTemplateDetailsWithSlug
  )

  /**
   * Update
   * @typedef {object} EmailTemplateRequest
   * @property {string} subject.required - subject
   * @property {string} content.required - content
   * @property {number} priority.required - priority
   * @property {boolean} isPublished.required
   *
   */

  /**
   * PUT /email-template/{slug}
   * @tags EMIAL-TEMPLATEs
   * @security JWT
   * @summary Update
   * @param {EmailTemplateRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .put(
    validator.validateRequestParams(
      commonSchema.slugSchema,
      "Update Email Template"
    ),
    validator.validateRequestBody(
      emailTemplateSchema.updateEmailTemplate,
      "Update Email Template"
    ),
    Auth,
    checkPermission(["SuperAdmin"]),
    emailtemplateCtrl.updateEmailTemplateWithSlug
  );

module.exports = router;
