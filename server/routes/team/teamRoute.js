const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const teamCtrl = require("../../controllers/team/teamController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const teamSchema = require("../../validation/schema/teamSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/changestatus/:id")
  /**
   * PUT /team/changestatus/{id}
   * @tags TEAMs
   * @security JWT
   * @summary Change Status
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {object} request.body.required - status
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
    teamCtrl.updateTeam
  );

router
  .route("/")

  /**
   * GET /team
   * @tags TEAMs
   * @security JWT
   * @summary Get list for superteams
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
    teamCtrl.getTeamListForAdmin
  )

  /**
   * Create
   * @typedef {object} newteamsRequest
   * @property {string} fullName.required - fullName
   * @property {string} email.required - email
   * @property {number} contactNumber.required - contactNumber
   * @property {string} pass.required - pass
   */

  /**
   * POST /team
   * @tags TEAMs
   * @security JWT
   * @summary Create
   * @param {newteamsRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "John Doe",
   * "email": "teams@getnada.com",
   * "contactNumber": "9834567890",
   * "image": "https://example.com/image.jpg"
   * }
   */
  .post(
    validator.validateRequestBody(teamSchema.createSchema, "Create"),
    Auth,
    checkPermission(["Teams"]),
    teamCtrl.addTeam
  );

router
  .route("/:id")

  /**
   * GET /team/{id}
   * @tags TEAMs
   * @security JWT
   * @summary Get Details
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.idSchema, "Get"),
    Auth,
    checkPermission(["Teams"]),
    teamCtrl.getTeamDetail
  )

  /**
   * @typedef {object} UpdateteamsRequest
   * @property {string} fullName.required - fullName
   * @property {number} contactNumber.required - contactNumber
   */

  /**
   * PUT /team/{id}
   * @tags TEAMs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {UpdateteamsRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "John Doe",
   * "contactNumber": "9834567890",
   * "image": "https://example.com/image.jpg"
   * }
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Update"),
    validator.validateRequestBody(teamSchema.updateSchema, "Update"),
    Auth,
    checkPermission(["Teams"]),
    teamCtrl.updateTeam
  );

module.exports = router;
