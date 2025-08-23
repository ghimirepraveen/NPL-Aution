const express = require("express");
const validator = require("../../validation/validator");

const userSchema = require("../../validation/schema/userSchema");
const commonSchema = require("../../validation/schema/commonSchema");
const { Auth, logoutAuth } = require("../../middlewares/Auth");
const authCtrl = require("../../controllers/auth/authController");
const router = express.Router();

router
  .route("/resend-verification-mail")

  /**
   * Resend Verification Mail
   * @typedef {object} ResendVerificationCodeRequest
   * @property {string} email.required - email
   */

  /**
   * POST /auth/resend-verification-mail
   * @tags AUTHs
   * @security JWT
   * @summary Resend Verification Mail
   * @param {ResendVerificationCodeRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .post(
    validator.validateRequestBody(
      userSchema.emailRequest,
      "Resend Verification Mail"
    ),
    authCtrl.resendVerificationCode
  );

router
  .route("/login")

  /**
   * Login with email & password
   * @typedef {object} LoginRequest
   * @property {string} email.required - email
   * @property {string} password.required - password
   *
   */

  /**
   * POST /auth/login
   * @tags AUTHs
   * @security JWT
   * @summary Login with email & password
   * @param {LoginRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */

  .post(
    validator.validateRequestBody(userSchema.loginRequest, "Login"),
    authCtrl.login
  );

router
  .route("/verify-email")

  /**
   * Verify mail
   * @typedef {object} VerifyEmailRequest
   * @property {string} email  - email
   * @property {string} code  - code
   */

  /**
   * POST /auth/verify-email
   * @tags AUTHs
   * @security JWT
   * @summary Verify mail
   * @param {VerifyEmailRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .post(
    validator.validateRequestBody(userSchema.emailWithCode, "Verify "),
    authCtrl.verifyEmail
  );

router
  .route("/forgot-password")

  /**
   * Forgot password
   * @typedef {object} ForgotPasswordRequest
   * @property {string} email.required - email
   */

  /**
   * POST /auth/forgot-password
   * @tags AUTHs
   * @security JWT
   * @summary Forgot password
   * @param {ForgotPasswordRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .post(
    validator.validateRequestBody(userSchema.emailRequest, "Forgot Password"),
    authCtrl.forgotPassword
  );

router
  .route("/check-reset-password-code")

  /**
   * Check reset password otp code validity
   * @typedef {object} ResetPassCodeRequest
   * @property {string} email  - email
   * @property {string} code  - code
   */

  /**
   * POST /auth/check-reset-password-code
   * @tags AUTHs
   * @security JWT
   * @summary Check reset password otp code validity
   * @param {ResetPassCodeRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */

  .post(
    validator.validateRequestBody(
      userSchema.emailWithCode,
      "Check reset Password token"
    ),
    authCtrl.checkResetPasswordCodeValidity
  );
router
  .route("/update-password-with-code")

  /**
   * Update Password with  forgot password code
   * @typedef {object} UpdatePasswordWithCodeRequest
   * @property {string} email  - email
   * @property {string} code  - code
   * @property {string} password  - password
   *
   */

  /**
   * POST /auth/update-password-with-code
   * @tags AUTHs
   * @security JWT
   * @summary Update Password with  forgot password code
   * @param {UpdatePasswordWithCodeRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */

  .post(
    validator.validateRequestBody(
      userSchema.updatePasswordWithCode,
      "Update Password with token"
    ),
    authCtrl.updatePasswordWithForgetPasswordCode
  );

router
  .route("/get-new-access-token")

  /**
   * new access and refresh token
   * @typedef {object} TokenRequest
   * @property {string} token  - token
   *
   */
  /**
   * POST /auth/get-new-access-token
   * @tags AUTHs
   * @security JWT
   * @summary Get new access and refresh token
   * @param {TokenRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */

  .post(
    validator.validateRequestBody(userSchema.tokenSchema, "Token"),
    authCtrl.getNewAccessToken
  );

router
  .route("/change-password")

  /**
   * Update Password with  forgot password code
   * @typedef  {object}ChangePasswordWithTokenRequest
   * @property {string} currentPassword  - currentPassword
   * @property {string} newPassword  - newPassword
   *
   */

  /**
   * POST /auth/change-password
   * @tags AUTHs
   * @security JWT
   * @summary Update Password with  forgot password code
   * @param {ChangePasswordWithTokenRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .post(
    validator.validateRequestBody(userSchema.updatePassword, "Change Password"),
    Auth,
    authCtrl.changePassword
  );

router
  .route("/my-profile")
  /**
   * GET /auth/my-profile
   * @tags AUTHs
   * @security JWT
   * @summary  Get my Profile
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(Auth, authCtrl.myProfile);

router
  .route("/basic-details")

  /**
   * BasicProfile Request
   * @typedef  {object} BasicProfileRequest
   * @property {string} fullName	  - fullName
   * @property {string} image	  - image
   *
   */

  /**
   * PUT /auth/basic-details
   * @tags AUTHs
   * @security JWT
   * @summary update
   * @param {BasicProfileRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   *  {
   * "fullName": "Fumm ka a",
   * "contactNumber": "9812345678",
   *  "province": "64c1e6f2d9a1f9d6b1e38f6a",
   *  "district": "64c1e6f2d9a1f9d6b1e38f6b",
   *  "municipality": "64c1e6f2d9a1f9d6b1e38f6c",
   * "lastBloodDonated": "2024-12-15T00:00:00.000Z",
   *  "isAvailable": true
   * }
   */

  .put(
    validator.validateRequestBody(userSchema.updateUser, "profile"),
    Auth,
    authCtrl.updateBasicProfile
  );

router
  .route("/logout")

  /**
   * Logout
   * @typedef  {object} LogoutRequest
   * @property {string} refreshToken  - refreshToken S
   */

  /**
   * PUT /auth/logout
   * @tags AUTHs
   * @security JWT
   * @summary Logout
   * @param {LogoutRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   *   * {
   * "refreshToken": "refresh token without bearer"
   * }
   */

  .put(
    validator.validateRequestBody(userSchema.logout, "Unlink device"),
    authCtrl.unlinkMyDevice
  );

module.exports = router;
