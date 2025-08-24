const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const playerCtrl = require("../../controllers/player/playerController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const playerSchema = require("../../validation/schema/playerSchema");
const { checkPermission } = require("../../middlewares/Guard");

// router
//   .route("/changestatus/:id")

//   /**
//    * PUT /admin/changestatus/{id}
//    * @tags Players
//    * @security JWT
//    * @summary Change Status
//    * @param {string} id.path - id (5e2583b17e234e3352723427)
//    * @param {object} request.body.required - status
//    * @return {SuccessObjectResponse} 200 - Success
//    * @return {ErrorResponse} 422 - Unprocessable (invalid input)
//    * @example request - example payload
//    * {
//    * "status": "Blocked"
//    * }
//    */

//   .put(
//     Auth,
//     validator.validateRequestParams(commonSchema.idSchema, "Update"),
//     validator.validateRequestBody(commonSchema.changeStatusSchema, "Update"),
//     Auth,
//     checkPermission(["Admin"]),
//     playerCtrl.updatePlayer
//   );

router
  .route("/")

  /**
   * GET /player
   * @tags PLAYERs
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
    playerCtrl.getPlayerListForAdmin
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
   * POST /player
   * @tags PLAYERs
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
   * "category": "A",
   * "image": "https://example.com/image.jpg"
   * }
   */
  .post(
    validator.validateRequestBody(playerSchema.createSchema, "Create"),
    Auth,
    playerCtrl.addPlayer
  );

router
  .route("/:id")

  /**
   * GET /player/{id}
   * @tags PLAYERs
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
    playerCtrl.getPlayerDetail
  )

  /**
   * @typedef {object} UpdateAdminRequest
   * @property {string} fullName.required - fullName
   * @property {number} contactNumber.required - contactNumber
   */

  /**
   * PUT /player/{id}
   * @tags PLAYERs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {UpdateAdminRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "John Doe",
   * "contactNumber": "9834567890",
   * "category": "A",
   * "image": "https://example.com/image.jpg"
   * }
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Update"),
    validator.validateRequestBody(playerSchema.updateSchema, "Update"),
    Auth,
    checkPermission(["Admin"]),
    playerCtrl.updatePlayer
  );

module.exports = router;
