const emailTemplateHelp = require("../../helpers/emailTemplateHelper");

const userOps = require("../../operations/users/userOp");
const TokenModel = require("../../models/tokenModel");
const jwt = require("jsonwebtoken");
const REFRESHJWTSECRET = process.env.REFRESH_JWT_SECRET;
const VERIFYJWTSECRET = process.env.VERIFICATION_SECRET;

//////
const crypto = require("crypto");
const GLOBALVARS = require("../../constants/globalConstant");
const CONSTANTS = require("../../constants/constant");

const resHelp = require("../../helpers/responseHelper");
const tokenHelp = require("../../helpers/tokenHelper");

const authOps = require("../../operations/auths/authOp");

const SALT = process.env.PASSWORD_SALT;
const ITERATIONS = parseInt(process.env.PASSWORD_ITERATIONS);
const KEYLEN = parseInt(process.env.PASSWORD_KEYLEN);
const ALGORITHM = process.env.PASSWORD_ALGORITHM;
const HASHTYPE = process.env.PASSWORD_HASHTYPE;

const resendVerificationCode = async (req, res, next) => {
  const data = req?.body;
  const existenceCheck = await authOps.alreadyExist(data.email);
  if (!existenceCheck) {
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.TITLE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.MESSAGE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.ERRORS
    );
  } else {
    if (existenceCheck.isEmailVerified) {
      resHelp.respondError(
        res,
        GLOBALVARS.errorStatusCode,
        CONSTANTS.AUTH.EMAIL_VERIFIED.TITLE,
        CONSTANTS.AUTH.EMAIL_VERIFIED.MESSAGE,
        CONSTANTS.AUTH.EMAIL_VERIFIED.ERRORS
      );
    } else {
      emailTemplateHelp.sendTemplateMail(existenceCheck, "email-verification");
      resHelp.respondSuccess(
        res,
        GLOBALVARS.successStatusCode,
        "Verification",
        `Verification link Sent to your mail address`
      );
    }
  }
};

const verifyEmail = async (req, res, next) => {
  const data = req?.body;
  const userDetails = await authOps.alreadyExist(data.email);
  if (!userDetails) {
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.TITLE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.MESSAGE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.ERRORS
    );
  } else {
    if (userDetails.emailVerifyCode != data.code) {
      resHelp.respondError(
        res,
        GLOBALVARS.errorStatusCode,
        CONSTANTS.AUTH.WRONG_OTP.TITLE,
        CONSTANTS.AUTH.WRONG_OTP.MESSAGE,
        CONSTANTS.AUTH.WRONG_OTP.ERRORS
      );
    } else {
      await authOps
        .updateUserProfileById(userDetails._id.toString(), {
          emailVerifyCode: 0,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        })
        .then(async (user) => {
          if (!user) {
            resHelp.respondError(
              res,
              GLOBALVARS.errorStatusCode,
              "Verification",
              "Failed to Verify"
            );
          } else {
            const userObjectModified = user.toObject();
            delete userObjectModified.password;
            const tokenizedUser = {
              _id: userObjectModified._id,
              email: userObjectModified.email,
              userType: userObjectModified.userType,
            };
            const atoken = await tokenHelp.generateJWTToken(
              tokenizedUser,
              "accessToken"
            );
            const refreshtoken = await tokenHelp.generateJWTToken(
              tokenizedUser,
              "refreshToken"
            );
            userObjectModified.accessToken = `${atoken.token}`;
            userObjectModified.refreshToken = `${refreshtoken.token}`;
            resHelp.respondSuccess(
              res,
              GLOBALVARS.successStatusCode,
              CONSTANTS.AUTH.VERIFIED_SUCCESS.TITLE,
              CONSTANTS.AUTH.VERIFIED_SUCCESS.MESSAGE,
              userObjectModified
            );
          }
        })
        .catch((e) => next(e));
    }
  }
};

const login = async (req, res, next) => {
  let data = req?.body;
  console.log("Login", data.email);
  await authOps
    .findUserByEmailWithPassword(data.email)
    .then(async (user) => {
      if (!user) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.TITLE,
          CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.MESSAGE,
          CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.ERRORS
        );
      } else {
        if (user.status == "Blocked") {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.AUTH.ACCOUNT_BLOCKED.TITLE,
            CONSTANTS.AUTH.ACCOUNT_BLOCKED.MESSAGE,
            CONSTANTS.AUTH.ACCOUNT_BLOCKED.ERRORS
          );
        }
        if (user.userType == "Vendor" && !user.isVendorVerified) {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.AUTH.VENDOR_NOT_VERIFIED.TITLE,
            CONSTANTS.AUTH.VENDOR_NOT_VERIFIED.MESSAGE,
            CONSTANTS.AUTH.VENDOR_NOT_VERIFIED.ERRORS
          );
        } else if (!user.isEmailVerified) {
          resHelp.respondError(
            res,
            GLOBALVARS.notVerified,
            CONSTANTS.AUTH.EMAIL_NOT_VERIFIED.TITLE,
            CONSTANTS.AUTH.EMAIL_NOT_VERIFIED.MESSAGE,
            CONSTANTS.AUTH.EMAIL_NOT_VERIFIED.ERRORS
          );
        } else {
          const hashPass = crypto.pbkdf2Sync(
            data.password,
            SALT,
            ITERATIONS,
            KEYLEN,
            ALGORITHM
          );

          if (hashPass.toString(HASHTYPE).toString().trim() != user.password) {
            resHelp.respondError(
              res,
              GLOBALVARS.errorStatusCode,
              CONSTANTS.AUTH.WRONG_CREDENTIAL.TITLE,
              CONSTANTS.AUTH.WRONG_CREDENTIAL.MESSAGE,
              CONSTANTS.AUTH.WRONG_CREDENTIAL.ERRORS
            );
          } else {
            const userObjectModified = user.toObject();
            // if (
            //   userObjectModified?.userType == "Rider" &&
            //   data?.userType == "Rider"
            // ) {
            // } else {
            delete userObjectModified.password;
            const tokenizedUser = {
              _id: userObjectModified._id,
              email: userObjectModified.email,
              userType: userObjectModified.userType,
            };
            const atoken = await tokenHelp.generateJWTToken(
              tokenizedUser,
              "accessToken"
            );
            const refreshtoken = await tokenHelp.generateJWTToken(
              tokenizedUser,
              "refreshToken"
            );
            userObjectModified.accessToken = `${atoken.token}`;
            userObjectModified.refreshToken = `${refreshtoken.token}`;
            resHelp.respondSuccess(
              res,
              GLOBALVARS.successStatusCode,
              CONSTANTS.AUTH.LOGIN_SUCCESS.TITLE,
              CONSTANTS.AUTH.LOGIN_SUCCESS.MESSAGE,
              userObjectModified
            );
            // }
          }
        }
      }
    })
    .catch((e) => next(e));
};

const forgotPassword = async (req, res, next) => {
  let data = req?.body;
  const existenceCheck = await authOps.alreadyExist(data.email);
  if (!existenceCheck) {
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.TITLE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.MESSAGE,
      CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.ERRORS
    );
  } else {
    let resetPasswordCodeValidTill = new Date();
    resetPasswordCodeValidTill = new Date(
      resetPasswordCodeValidTill.getTime() + 120 * 1000
    );
    const updatedUser = await authOps.updateUserProfileById(
      existenceCheck._id,
      {
        resetPasswordCode: Math.floor(100000 + Math.random() * 900000),
        resetPasswordCodeValidTill,
      }
    );
    emailTemplateHelp.sendTemplateMail(updatedUser, "forgot-password");

    resHelp.respondSuccess(
      res,
      GLOBALVARS.successStatusCode,
      CONSTANTS.AUTH.FORGOT_PASSWORD_MAIL.TITLE,
      CONSTANTS.AUTH.FORGOT_PASSWORD_MAIL.MESSAGE,
      CONSTANTS.AUTH.FORGOT_PASSWORD_MAIL.ERRORS
    );
  }
};

const checkResetPasswordCodeValidity = async (req, res, next) => {
  const data = req?.body;
  let user = await authOps.findUserByEmailWithPassword(data.email);
  if (!user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.gone,
      CONSTANTS.AUTH.OTP_EXPIRED.TITLE,
      CONSTANTS.AUTH.OTP_EXPIRED.MESSAGE,
      CONSTANTS.AUTH.OTP_EXPIRED.ERRORS
    );
  } else {
    if (user.resetPasswordCode != data.code) {
      resHelp.respondError(
        res,
        GLOBALVARS.gone,
        CONSTANTS.AUTH.OTP_EXPIRED.TITLE,
        CONSTANTS.AUTH.OTP_EXPIRED.MESSAGE,
        CONSTANTS.AUTH.OTP_EXPIRED.ERRORS
      );
    } else {
      resHelp.respondSuccess(
        res,
        GLOBALVARS.successStatusCode,
        CONSTANTS.AUTH.RESET_PASSWORD_SUCCESS.TITLE,
        CONSTANTS.AUTH.RESET_PASSWORD_SUCCESS.MESSAGE
      );
    }
  }
};

const updatePasswordWithForgetPasswordCode = async (req, res, next) => {
  const data = req?.body;
  let user = await authOps.findUserByEmail(data.email);
  if (!user) {
    //ignoring user not found
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.OTP_EXPIRED.TITLE,
      CONSTANTS.AUTH.OTP_EXPIRED.MESSAGE,
      CONSTANTS.AUTH.OTP_EXPIRED.ERRORS
    );
  } else {
    if (user.resetPasswordCode != data.code) {
      resHelp.respondError(
        res,
        GLOBALVARS.errorStatusCode,
        CONSTANTS.AUTH.WRONG_OTP.TITLE,
        CONSTANTS.AUTH.WRONG_OTP.MESSAGE,
        CONSTANTS.AUTH.WRONG_OTP.ERRORS
      );
    } else {
      let hashPass = crypto.pbkdf2Sync(
        data.password,
        SALT,
        ITERATIONS,
        KEYLEN,
        ALGORITHM
      );
      user.password = hashPass.toString(HASHTYPE);
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.emailVerifiedAt = new Date();
      }
      user.save();
      resHelp.respondSuccess(
        res,
        GLOBALVARS.successStatusCode,
        CONSTANTS.AUTH.RESET_PASSWORD_SUCCESS.TITLE,
        CONSTANTS.AUTH.RESET_PASSWORD_SUCCESS.MESSAGE
      );
    }
  }
};

const getProfile = async (req, res, next) => {
  let id = req?.params?.id;

  await authOps
    .getUserDetails(id)
    .then(async (user) => {
      if (!user) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.AUTH.PROFILE_GET_FAILED.TITLE,
          CONSTANTS.AUTH.PROFILE_GET_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.AUTH.PROFILE_GET_SUCCESS.TITLE,
          CONSTANTS.AUTH.PROFILE_GET_SUCCESS.MESSAGE,
          user
        );
      }
    })
    .catch((e) => next(e));
};

const myProfile = async (req, res, next) => {
  const id = req?.user?._id;

  await authOps
    .getUserDetails(id)
    .then(async (user) => {
      if (!user) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.AUTH.PROFILE_GET_FAILED.TITLE,
          CONSTANTS.AUTH.PROFILE_GET_FAILED.MESSAGE
        );
      } else {
        if (user.status == "Blocked") {
          resHelp.respondError(
            res,
            GLOBALVARS.errorStatusCode,
            CONSTANTS.AUTH.ACCOUNT_BLOCKED.TITLE,
            CONSTANTS.AUTH.ACCOUNT_BLOCKED.MESSAGE
          );
        } else {
          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.AUTH.PROFILE_GET_SUCCESS.TITLE,
            CONSTANTS.AUTH.PROFILE_GET_SUCCESS.MESSAGE,
            user
          );
        }
      }
    })
    .catch((e) => next(e));
};

const changePassword = async (req, res, next) => {
  const data = req?.body;
  const userDetail = await authOps.findUserByEmailWithPassword(req.user.email);

  let currentHashPass = crypto.pbkdf2Sync(
    data.currentPassword,
    SALT,
    ITERATIONS,
    KEYLEN,
    ALGORITHM
  );
  // console.log({ "current": currentHashPass.toString(HASHTYPE).toString(), "old": userDetail.password.toString() })

  if (
    currentHashPass.toString(HASHTYPE).toString().trim() !=
    userDetail.password.toString().trim()
  ) {
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.WRONG_CURRENT_PASSWRD.TITLE,
      CONSTANTS.AUTH.WRONG_CURRENT_PASSWRD.MESSAGE,
      CONSTANTS.AUTH.WRONG_CURRENT_PASSWRD.ERRORS
    );
  } else if (data.currentPassword == data.newPassword) {
    resHelp.respondError(
      res,
      GLOBALVARS.errorStatusCode,
      CONSTANTS.AUTH.SAME_AS_OLD_PASSWRD.TITLE,
      CONSTANTS.AUTH.SAME_AS_OLD_PASSWRD.MESSAGE,
      CONSTANTS.AUTH.SAME_AS_OLD_PASSWRD.ERRORS
    );
  } else {
    let hashPass = crypto.pbkdf2Sync(
      data.newPassword,
      SALT,
      ITERATIONS,
      KEYLEN,
      ALGORITHM
    );
    let hashPassword = hashPass.toString(HASHTYPE);
    await authOps
      .updateUserProfileById(req.user._id, {
        password: hashPassword,
      })
      .then(async (updatedUser) => {
        if (updatedUser) {
          //logout from all others
          let logoutAll = await tokenHelp.removeAllTokenOfUser(
            updatedUser._id.toString()
          );
          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            "Change Password",
            "Succcessfully Changed Password"
          );
        }
      });
  }
};

const updateBasicProfile = async (req, res, next) => {
  const data = req?.body;
  const userId = req?.user?._id;
  await authOps
    .updateUserProfileById(userId, data)
    .then(async (user) => {
      if (!user) {
        resHelp.respondError(
          res,
          GLOBALVARS.errorStatusCode,
          CONSTANTS.AUTH.PROFILE_UPDATE_FAILED.TITLE,
          CONSTANTS.AUTH.PROFILE_UPDATE_FAILED.MESSAGE
        );
      } else {
        resHelp.respondSuccess(
          res,
          GLOBALVARS.successStatusCode,
          CONSTANTS.AUTH.PROFILE_UPDATE_SUCCESS.TITLE,
          CONSTANTS.AUTH.PROFILE_UPDATE_SUCCESS.MESSAGE,
          user
        );
      }
    })
    .catch((e) => next(e));
};

const getNewAccessToken = async (req, res, next) => {
  const token = req?.body.token;
  const jwtVerify = await jwt.verify(
    token,
    REFRESHJWTSECRET,
    (err, decoded) => {
      if (err) {
        return false;
      } else {
        return decoded;
      }
    }
  );

  if (jwtVerify) {
    const refreshToken = await tokenHelp
      .checkValidToken(token)
      .catch((e) => next(e));

    if (!refreshToken) {
      resHelp.respondError(
        res,
        GLOBALVARS.refreshTokenExpired,
        CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
        CONSTANTS.AUTH.REFRESH_INVALID.MESSAGE
      );
    } else {
      const userDetails = await authOps.findUserByEmail(jwtVerify.email);
      if (!userDetails) {
        resHelp.respondError(
          res,
          GLOBALVARS.refreshTokenExpired,
          CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
          CONSTANTS.AUTH.ACCOUNT_NOT_FOUND.MESSAGE
        );
      } else if (userDetails && userDetails.status === "Blocked") {
        return resHelp.respondError(
          res,
          GLOBALVARS.refreshTokenExpired,
          CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
          CONSTANTS.AUTH.ACCOUNT_BLOCKED.MESSAGE
        );
      } else if (userDetails.isDeleted) {
        return resHelp.respondError(
          res,
          GLOBALVARS.refreshTokenExpired,
          CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
          "Account Deleted"
        );
        u;
      } else {
        if (refreshToken) {
          let tokenizedUser = {
            _id: jwtVerify._id,
            email: jwtVerify.email,
            userType: jwtVerify.userType,
          };
          let t = await tokenHelp.generateJWTToken(
            tokenizedUser,
            "accessToken"
          );
          let rt = await tokenHelp.generateJWTToken(
            tokenizedUser,
            "refreshToken"
          );

          let makeRefreshTokenInvalid = await tokenHelp
            .changeJWTTokenToUsed(token)
            .catch((e) => next(e));
          //
          resHelp.respondSuccess(
            res,
            GLOBALVARS.successStatusCode,
            CONSTANTS.AUTH.REFRESH_SUCCESS.TITLE,
            CONSTANTS.AUTH.REFRESH_SUCCESS.MESSAGE,
            {
              accessToken: `${t.token}`,
              refreshToken: `${rt.token}`,
            }
          );
        } else {
          resHelp.respondError(
            res,
            GLOBALVARS.refreshTokenExpired,
            CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
            CONSTANTS.AUTH.REFRESH_INVALID.MESSAGE
          );
        }
      }
    }
  } else {
    resHelp.respondError(
      res,
      GLOBALVARS.refreshTokenExpired,
      CONSTANTS.AUTH.REFRESH_INVALID.TITLE,
      CONSTANTS.AUTH.REFRESH_INVALID.MESSAGE
    );
  }
};

const unlinkMyDevice = async (req, res, next) => {
  const data = req?.body;
  if (data.refreshToken) {
    const result = await TokenModel.findOneAndDelete({
      token: data.refreshToken,
      // userId: req.user._id,
    });
  }

  if (data.refreshToken) {
    resHelp.respondSuccess(
      res,
      GLOBALVARS.successStatusCode,
      CONSTANTS.AUTH.LOGOUT_SUCCESS.TITLE,
      CONSTANTS.AUTH.LOGOUT_SUCCESS.MESSAGE
    );
  }
};

module.exports = {
  login,
  verifyEmail,
  resendVerificationCode,

  forgotPassword,
  checkResetPasswordCodeValidity,
  updatePasswordWithForgetPasswordCode,
  changePassword,

  myProfile,
  getProfile,
  updateBasicProfile,

  getNewAccessToken,
  unlinkMyDevice,
};
