const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const adminCtrl = require("../../controllers/admin/adminController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schemas/commonSchema");
const adminSchema = require("../../validation/schemas/adminSchema");
const { checkPermission } = require("../../middlewares/Guard");

/**
 * Error Response
 * @typedef {object} ErrorResponse
 * @property {string} title - title
 * @property {string} message - message
 */

/**
 * Success Object Response
 * @typedef {object} SuccessObjectResponse
 * @property {string} title - title
 * @property {string} message - message
 * @property {object} data
 */
/**
 * Success Array Response
 * @typedef {object} SuccessArrayResponse
 * @property {string} title - title
 * @property {string} message - message
 * @property {array<object>} data
 */

router
  .route("/changestatus/:id")

  /**
   * @typedef {object} ChangeStatusRequest
   * @property {string} status.required - status
   */

  /**
   * PUT /admin/changestatus/{id}
   * @tags ADMINs
   * @security JWT
   * @summary Change Status
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {ChangeStatusRequest} request.body.required - status
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "status": "Blocked"
   * }
   */

  .put(
    Auth,
    validator.validateRequestParams(commonSchema.idSchema, "Update"),
    validator.validateRequestBody(commonSchema.changeStatusSchema, "Update"),
    Auth,
    checkPermission(["Admin"]),
    adminCtrl.updateAdmin
  );

router
  .route("/")

  /**
   * GET /admin
   * @tags ADMINs
   * @security JWT
   * @summary Get list for superadmin
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    Auth,
    checkPermission(["Admin"]),

    adminCtrl.getAdminListForSuperAdmin
  )

  /**
   * Create
   * @typedef {object} newAdminRequest
   * @property {string} fullName.required - fullName
   * @property {string} email.required - email
   * @property {number} contactNumber.required - contactNumber
   * @property {string} pass.required - pass
   */

  /**
   * POST /admin
   * @tags ADMINs
   * @security JWT
   * @summary Create
   * @param {newAdminRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "John Doe",
   * "email": "admin@getnada.com",
   * "contactNumber": "9834567890",
   * }
   */
  .post(
    validator.validateRequestBody(adminSchema.createSchema, "Create"),
    Auth,
    adminCtrl.addAdmin
  );

router
  .route("/:id")

  /**
   * GET /admin/{id}
   * @tags ADMINs
   * @security JWT
   * @summary Get Details
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.idSchema, "Get"),
    Auth,
    checkPermission(["Admin"]),
    adminCtrl.getAdminDetail
  )

  /**
   * @typedef {object} UpdateAdminRequest
   * @property {string} fullName.required - fullName
   * @property {number} contactNumber.required - contactNumber
   */

  /**
   * PUT /admin/{id}
   * @tags ADMINs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {UpdateAdminRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "John Doe",
   * "contactNumber": 1234567890,
   * }
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Update"),
    validator.validateRequestBody(adminSchema.updateSchema, "Update"),
    Auth,
    checkPermission(["Admin"]),
    adminCtrl.updateAdmin
  );

module.exports = router;
