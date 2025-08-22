const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Token = require("./../models/tokenModel");
const User = require("./../models/userModel");

const JWTSECRET = process.env.JWT_SECRET;
const ACCESSTOKENEXPIREIN = process.env.ACCESS_TOKEN_EXPIRE_IN * 60;

const REFRESHJWTSECRET = process.env.REFRESH_JWT_SECRET;
const REFRESHTOKENEXPIREIN = process.env.REFRESH_TOKEN_EXPIRE_IN * 60;

const VERIFICATIONJWTSECRET = process.env.VERIFICATIONJWTSECRET;

const FORGOTPASSWORDJWTSECRET = process.env.FORGOT_PASSWORD_SECRET;
const FORGOTTOKENEXPIREIN = process.env.FORGOT_PASSWORD_EXPIRE_IN * 60;
const spareTime = 60 * 24 * 1000;

const generateJWTToken = async (user, tokenType) => {
  let secret = JWTSECRET;
  let expiresIn = ACCESSTOKENEXPIREIN;
  switch (tokenType) {
    case "accessToken":
      secret = JWTSECRET;
      expiresIn = ACCESSTOKENEXPIREIN;
      break;
    case "refreshToken":
      secret = REFRESHJWTSECRET;
      expiresIn = REFRESHTOKENEXPIREIN;
      break;
    case "forgot-password":
      secret = FORGOTPASSWORDJWTSECRET;
      expiresIn = FORGOTTOKENEXPIREIN;
      break;
    case "emailVerificationToken":
      secret = VERIFICATIONJWTSECRET;
      break;
  }

  const token = await jwt.sign(user, secret, { expiresIn });

  let timeObject = new Date();
  expiresAfterTime = new Date(
    timeObject.getTime() + expiresIn * 1000 + spareTime
  );
  timeObject = new Date(timeObject.getTime() + expiresIn * 1000);
  if (tokenType != "accessToken") {
    //save new token

    const savetoken = new Token({
      userId: user._id,
      token,
      tokenType,
      expireAfter: expiresAfterTime,
      // isUsed: false,  //avoiding isused refresh token
    });
    const result = await savetoken.save();

    return { token, expireTime: timeObject };
  } else {
    return { token, expireTime: timeObject };
  }
};

const updateJWTToken = async (token) => {
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
    return true;
  } else {
    return false;
  }
};

const changeJWTTokenToUsed = async (token) => {
  const result = await Token.findOneAndUpdate(
    { token },
    { isUsed: true },
    { upsert: true, new: true }
  ).exec();
};

const checkValidToken = async (token) => {
  const result = await Token.findOne({
    token,
    tokenType: "refreshToken",
    isUsed: false,
  });

  return result;
  // const jwtVerify = await jwt.verify(
  //   token,
  //   REFRESHJWTSECRET,
  //   (err, decoded) => {
  //     if (err) {
  //       return false;
  //     } else {
  //       return decoded;
  //     }
  //   }
  // );
  // if (jwtVerify) {
  //   return true;
  // } else {
  //   return false;
  // }
};

const removeAllTokenOfUser = async (userId) => {
  const result = await Token.deleteMany({ userId });
  return result;
};

module.exports = {
  generateJWTToken,
  updateJWTToken,
  checkValidToken,
  changeJWTTokenToUsed,
  removeAllTokenOfUser,
};
