const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const siteSettingCtrl = require("../../controllers/siteSetting/siteSettingController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schema/commonSchema");
const siteSettingSchema = require("../../validation/schema/siteSettingSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/seo-for")

  /**
   * @typedef {object} SEORequest
   * @property {string} seoFor  - seoFor
   * @property {string} metaTitle  - metaTitle
   * @property {string} metaDescription  - metaDescription
   * @property {string} metaRobots  - metaRobots
   * @property {string} canonicalUrl  - canonicalUrl
   * @property {string} socialImage  - socialImage
   */

  /**
   * PUT /site-setting/seo-for
   * @tags SITESETTINGs
   * @security JWT
   * @summary Update
   * @param {SEORequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .put(
    validator.validateRequestBody(siteSettingSchema.seoPage, "seo"),
    Auth,
    checkPermission(["Admin"]),

    siteSettingCtrl.updateSeoPage
  );

router
  .route("/for-public")

  /**
   * GET /site-setting/for-public
   * @tags SITESETTINGs
   * @summary Get Details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid input)
   */
  .get(siteSettingCtrl.getSiteSetting);

router
  .route("/")

  /**
   * GET /site-setting
   * @tags SITESETTINGs
   * @security JWT
   * @summary Get list
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   */
  .get(
    validator.validateRequestQuery(
      commonSchema.listingSchema,
      "Site Setting Listing"
    ),
    Auth,
    checkPermission(["Admin"]),
    siteSettingCtrl.getSiteSettingForAdmin
  )
  /**
   * @typedef {object} aboutUs
   * @property {string} description - description
   * @property {string} mission - mission
   * @property {string} vision - vision
   * @property {string} missionVisionImage - missionVisionImage
   * @property {string} firstImage - missionVisionShortDescription
   * @property {string} firstImage - firstImage
   * @property {string} secondImage - secondImage
   * @property {string} thirdImage - thirdImage
   */
  /**
   * @typedef {object} whyChooseUs
   * @property {string} description - description
   * @property {string} image - image
   *
   *
   *
   */
  /**
   * @typedef {object} banner
   * @property {string} bannerImage - bannerImage
   * @property {string} bannerTitle - bannerTitle
   * @property {string} bannerDescription - bannerDescription
   */

  /**
   * @typedef {object} siteSettingRequest
   * @property {string} contactNumber - contactNumber
   * @property {string} contactNumbers - contactNumbers
   * @property {string} address - address
   * @property {string} shortDescription - shortDescription
   * @property {string} email - email
   * @property {string} findUsMapLink  - findUsMapLink
   * @property {string} facebookLink  - facebookLink
   * @property {string} instagramLink  - instagramLink
   * @property {string} tiktokLink  - tiktokLink
   * @property {string} twitterLink  - twitterLink
   * @property {string} pinInterestLink  - pinInterestLink
   * @property {string} youtubeLink  - youtubeLink
   * @property {aboutUs} aboutUs - aboutUs
   * @property {whyChooseUs} whyChooseUs - whyChooseUs

   */
  /**
   * PUT /site-setting
   * @tags SITESETTINGs
   * @security JWT
   * @summary Update
   * @param {siteSettingRequest} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   *{
   *  "aboutUs": {
   *    "mission": "To empower businesses with cutting-edge technology and exceptional service.",
   *    "vision": "To be the global leader in providing creative and technology-driven solutions.",
   *    "missionVisionShortDescription": "At Nepacourie, our mission is to provide reliable, fast, and cost-effective delivery solutions that connect people and businesses across regions. We are committed to ensuring every parcel is handled with care and delivered on time, offering excellent customer service and a seamless experience for all our clients.",
   *    "missionVisionImage": "https://oms-softbenz-storage.s3.ap-south-1.amazonaws.com/nepacouri/why_choose_us/why_choose_us-1733125249863.jpeg",
   *    "description": "<p>Welcome to Nepacourie, your trusted partner in reliable and efficient courier services. We are committed to providing exceptional delivery solutions tailored to meet the diverse needs of businesses and individuals alike. Whether you're sending packages locally or internationally, Nepacourie ensures your parcels reach their destination quickly, safely, and at an affordable cost.At Nepacourie, we pride ourselves on our customer-first approach, focusing on reliability, punctuality, and quality service. Our experienced team leverages state-of-the-art technology to track shipments in real-time, providing our clients with the peace of mind that their deliveries are in safe hands. From small parcels to large shipments, we have the expertise and resources to handle every delivery with the utmost care.Our services include same-day deliveries, express shipping, international shipping, and custom logistics solutions. We understand the importance of speed and reliability in today’s fast-paced world, and we are dedicated to delivering excellence in every aspect of our service.Choose Nepacourie for all your courier needs, and experience a hassle-free, streamlined delivery service designed to keep your world moving. Let us help you deliver your promises with speed, reliability, and care.</p>",
   *    "firstImage": "https://oms-softbenz-storage.s3.ap-south-1.amazonaws.com/nepacouri/our_story/our_story-1732876383408.jpeg",
   *    "secondImage": "https://oms-softbenz-storage.s3.ap-south-1.amazonaws.com/nepacouri/our_story/our_story-1732876398614.webp",
   *    "thirdImage": "https://oms-softbenz-storage.s3.ap-south-1.amazonaws.com/nepacouri/our_story/our_story-1732876407454.jpeg"
   *  },
   *  "whyChooseUs": {
   *    "description": "We are committed to delivering outstanding customer service and customized solutions that drive results. Our team of experts ensures that every project is executed with precision and excellence.",
   *    "image": "https://oms-softbenz-storage.s3.ap-south-1.amazonaws.com/nepacouri/why_choose_us/why_choose_us-1732876413817.jpeg"
   *  },
   *  "address": "123 Main St, Springfield, IL, USA",
   *  "contactNumber": "9876677456",
   *  "contactNumbers": ["9876677456"],
   *  "email": "info@business.com",
   *  "facebookLink": "https://facebook.com/businesspage",
   *  "findUsMapLink": "https://maps.app.goo.gl/QdkkXsARYWvtKEnz8",
   *  "instagramLink": "https://instagram.com/businesspage",
   *  "pinInterestLink": "https://pinterest.com/businesspage",
   *  "tiktokLink": "https://tiktok.com/@businesspage",
   *  "twitterLink": "https://twitter.com/businesspage",
   *  "youtubeLink": "https://youtube.com/c/businesschannel",
   * "appleStoreLink":"https://youtube.com/c/businesschannel" ,
   * "googlePlayStoreLink": "https://youtube.com/c/businesschannel",
   * "shortDescription": "We are a leading provider of innovative solutions, helping businesses grow and succeed in today's competitive market."
   *}
   */

  .put(
    validator.validateRequestBody(
      siteSettingSchema.siteSetting,
      "Site Setting"
    ),
    Auth,
    checkPermission(["Admin"]),

    siteSettingCtrl.addSiteSetting
  );

module.exports = router;
