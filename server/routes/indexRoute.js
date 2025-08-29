const express = require("express");

const uploaderRoute = require("./uploader/uploaderRoute");

const authRoute = require("./auth/authRoute");
const adminRoute = require("./admin/adminRoute");
const teamRoute = require("./team/teamRoute");
const playerRoute = require("./player/playerRoute");
const bidLog = require("../routes/log/logRoute");

const emailTemplateRoute = require("./emailTemplate/emailTemplateRoute");
const siteSettingRoute = require("./siteSetting/siteSettingRoute");

const router = express.Router();

router.use(`/auth`, authRoute);

router.use(`/email-template`, emailTemplateRoute);
router.use(`/upload`, uploaderRoute);
router.use(`/admin`, adminRoute);

router.use(`/site-setting`, siteSettingRoute);
router.use(`/team`, teamRoute);
router.use(`/player`, playerRoute);

router.use(`/bid-log`, bidLog);

module.exports = router;
