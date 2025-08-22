const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const resHelp = require("../helpers/responseHelper");
const GLOBALVARS = require("../constants/globalConstant");

const JWT_SECRET = process.env.JWT_SECRET;

const Auth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    // JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const jwtVerify = await jwt.verify(
      req.headers["authorization"].split(" ")[1],
      JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return resHelp.respondError(res, 401, "", "Invalid token");
        } else {
          let user = await User.findOne({ _id: decoded._id, isDeleted: false });

          if (!user) {
            return resHelp.respondError(res, 401, "", "Account Not Found");
          }

          if (user && user.status === "Blocked") {
            return resHelp.respondError(
              res,
              401,
              "",
              "Account Blocked By Admin"
            );
          }
          req.user = user;
          next();
        }
      }
    );
  } else {
    return resHelp.respondError(res, 403, "", "Authorization headers required");
  }
};

const logoutAuth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    const jwtVerify = await jwt.verify(
      req.headers["authorization"].split(" ")[1],
      JWT_SECRET,
      { ignoreExpiration: true },
      async (err, decoded) => {
        if (err) {
          return resHelp.respondError(res, 401, "", "Invalid token");
        } else {
          let user = await User.findOne({ _id: decoded._id });
          req.user = user;
          next();
        }
      }
    );
  } else {
    return resHelp.respondError(res, 403, "", "Authorization headers required");
  }
};
const optionalAuth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    await jwt.verify(
      req.headers["authorization"].split(" ")[1],
      JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          next();
        } else {
          let user = await User.findOne({ _id: decoded._id });
          req.user = decoded;
          next();
        }
      }
    );
  } else {
    next();
  }
};

module.exports = {
  Auth,
  logoutAuth,
  optionalAuth,
};
