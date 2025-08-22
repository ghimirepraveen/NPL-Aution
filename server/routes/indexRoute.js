const express = require("express");

const uploaderRoute = require("./uploader/uploaderRoute");

const authRoute = require("./auth/authRoute");
const adminRoute = require("./admin/adminRoute");
const userRoute = require("./user/userRoute");

const emailTemplateRoute = require("./emailTemplate/emailTemplateRoute");
const siteSettingRoute = require("./siteSetting/siteSettingRoute");
const pageRoute = require("./page/pageRoute");

const articalRoute = require("./artical/articalRoute");
const faqRoute = require("./faq/faqRoute");
const eventRoute = require("./event/eventRoute");

const router = express.Router();

router.use(`/auth`, authRoute);

router.use(`/page`, pageRoute);
router.use(`/email-template`, emailTemplateRoute);
router.use(`/upload`, uploaderRoute);
router.use(`/admin`, adminRoute);
router.use(`/user`, userRoute);

router.use(`/site-setting`, siteSettingRoute);

router.use(`/article`, articalRoute);
router.use(`/faq`, faqRoute);
router.use(`/event`, eventRoute);

module.exports = router;
