const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const userCtrl = require("../../controllers/user/userController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const userSchema = require("../../validation/schema/userSchema");
const { checkPermission } = require("../../middlewares/Guard");

// router
//   .route("/for-admin")

//   /**
//    * GET /user/for-admin
//    * @tags USERs
//    * @security JWT
//    * @summary Get list for superadmin
//    * @param {number} page.query - 1 by default
//    * @param {number} limit.query - 10 by default
//    * @param {number} province.query - 6835562404795c19c7ca23d2
//    * @param {number} district.query - 6835562404795c19c7ca23d2
//    * @param {number} municipality.query - 6835562404795c19c7ca23d2
//    * @param {number} bloodGroup.query - A-
//    * @return {SuccessArrayResponse} 200 - Success
//    * @return {ErrorResponse} 422 - Unprocessable (invalid input)
//    */
//   .get(
//     validator.validateRequestQuery(commonSchema.listingSchema, "List"),
//     Auth,
//     checkPermission(["Admin"]),
//     userCtrl.getUserListForAdmin
//   );

router
  .route("/donor/for-public")
  /**
   * GET /user/donor/for-public
   * @tags USERs
   * @security JWT
   * @summary Get list for pubblic 681b2753d487508d5753cd82
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @param {string} province.query - 6835562404795c19c7ca23d2
   * @param {string} district.query - 6835562404795c19c7ca23d2
   * @param {string} municipality.query - 6835562404795c19c7ca23d2
   * @param {string} bloodGroup.query - A-
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
    
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    userCtrl.getDonorListForPublic
  );

router
  .route("/donor/for-user")
  /**
   * GET /user/donor/for-user
   * @tags USERs
   * @security JWT
   * @summary Get list for superadmin
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @param {string} province.query - 6835562404795c19c7ca23d2
   * @param {string} district.query - 6835562404795c19c7ca23d2
   * @param {string} municipality.query - 6835562404795c19c7ca23d2
   * @param {string} bloodGroup.query - A-
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    Auth,
    checkPermission(["User"]),
    userCtrl.getDonorListForUser
  );

router
  .route("/register")

  /**
   * POST /user/register
   * @tags USERs
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
   * "gender":"M",
   * "dob":"2044-02-20",
   * "lastBloodDonated":"2044-02-20",
   * "bloodGroup":"A+",
   * "password":"Password@123",
   * "isAvailable":true,
   * "province":"681b2753d487508d5753cd82",
   * "district":"681b2753d487508d5753cd82",
   * "municipality":"681b2753d487508d5753cd82"
   * }
   */
  .post(
    validator.validateRequestBody(userSchema.addUser, "Register"),
    userCtrl.addUser
  );

router
  .route("/changestatus/:id")

  /**
   * PUT /user/changestatus/{id}
   * @tags USERs
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
    userCtrl.updateUser
  );

router
  .route("/")

  /**
   * GET /user
   * @tags USERs
   * @security JWT
   * @summary Get list for superadmin
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @param {string} province.query - 6835562404795c19c7ca23d2
   * @param {string} district.query - 6835562404795c19c7ca23d2
   * @param {string} municipality.query - 6835562404795c19c7ca23d2
   * @param {string} bloodGroup.query - A-
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "List"),
    Auth,
    checkPermission(["Admin"]),
    userCtrl.getUserListForAdmin
  )

  /**
   * POST /user
   * @tags USERs
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
   * "gender":"M",
   * "dob":"2044-02-20",
   * "password":"qqqqqqqq",
   * "lastBloodDonated":"2044-02-20",
   * "bloodGroup":"A+",
   * "isAvailable":true,
   * "province":"681b2753d487508d5753cd82",
   * "district":"681b2753d487508d5753cd82",
   * "municipality":"681b2753d487508d5753cd82"
   * }
   */
  .post(
    validator.validateRequestBody(userSchema.addUserByAdmin, "Create"),
    Auth,
    checkPermission(["Admin"]),
    userCtrl.addUserByAdmin
  );

router
  .route("/:id")

  /**
   * GET /user/{id}
   * @tags USERs
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
    userCtrl.getUserDetail
  )

  /**
   * @typedef {object} UpdateAdminRequest
   * @property {string} fullName.required - fullName
   * @property {number} contactNumber.required - contactNumber
   */

  /**
   * PUT /user/{id}
   * @tags USERs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {UpdateAdminRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request - example payload
   * {
   * "fullName": "Prabin Ghimire",
   * "contactNumber": "9812345678",
   * "province": "64c1e6f2d9a1f9d6b1e38f6a",
   * "district": "64c1e6f2d9a1f9d6b1e38f6b",
   * "municipality": "64c1e6f2d9a1f9d6b1e38f6c",
   * "lastBloodDonated": "2024-12-15T00:00:00.000Z",
   * "isAvailable": true
   * }
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Update"),
    validator.validateRequestBody(userSchema.updateUser, "Update"),
    Auth,
    checkPermission(["Admin"]),
    userCtrl.updateUser
  );

module.exports = router;
