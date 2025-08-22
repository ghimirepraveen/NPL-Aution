const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const articalCtrl = require("../../controllers/artical/articalController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schemas/commonSchema");
const articalSchema = require("../../validation/schemas/articalSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/for-public-related")

  /**
   * GET /article/for-public-related
   * @tags ARTICLEs
   * @security JWT
   * @summary Get Details
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @param {string} artical.query - 681053638e4a01fc227eaf1d
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.listingSchema, "Artical"),
    articalCtrl.getRelatedArticalListForPublic
  );

router
  .route("/for-public")

  /**
   * GET /article/for-public
   * @tags ARTICLEs
   * @security JWT
   * @summary Get Details
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.listingSchema, "Artical"),
    articalCtrl.getArticalListForPublic
  );

router
  .route("/for-public/:slug")

  /**
   * GET /article/for-public/{slug}
   * @tags ARTICLEs
   * @security JWT
   * @summary Get Details
   * @param {string} slug.path - id (abbabababababaab)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.slugSchema, "Artical"),
    articalCtrl.getArticalDetailBySlug
  );

router
  .route("/")

  /**
   * GET /article
   * @tags ARTICLEs
   * @security JWT
   * @summary Get list for
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessArrayResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   *
   */
  .get(
    validator.validateRequestQuery(commonSchema.listingSchema, "Artical"),
    Auth,
    checkPermission(["Admin"]),
    articalCtrl.getArticalListForAdmin
  )

  /**
   * POST /article
   * @tags ARTICLEs
   * @security JWT
   * @summary Create
   * @param {object} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   * {
   *   "title": "Technology Updates",
   *   "priority": 1,
   *   "featuredImage": [
   *     {
   *       "image": "https://example.com/images/featured1.jpg",
   *       "alt": "Featured Image 1"
   *     },
   *     {
   *       "image": "https://example.com/images/featured2.jpg",
   *       "alt": "Another featured image"
   *     }
   *   ],
   *  "isPublished":true,
   *   "shortDescription": "Latest trends and updates in technology.",
   *   "description": "This Artical covers all the latest news, trends, and innovations in the tech world."
   * }
   *
   */
  .post(
    validator.validateRequestBody(articalSchema.Artical, "Artical"),
    Auth,
    checkPermission(["Admin"]),
    articalCtrl.addArtical
  );

router
  .route("/:id")

  /**
   * GET /article/{id}
   * @tags ARTICLEs
   * @security JWT
   * @summary Get Details
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.idSchema, "Artical"),
    Auth,
    checkPermission(["Admin"]),
    articalCtrl.getArticalDetail
  )

  /**
   * PUT /article/{id}
   * @tags ARTICLEs
   * @security JWT
   * @summary Update
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @param {object} request.body.required - details
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 422 - Unprocessable (invalid input)
   * @example request -  example payload
   * {
   *   "title": "Technology Updates",
   *   "priority": 1,
   *   "featuredImage": [
   *     {
   *       "image": "https://example.com/images/featured1.jpg",
   *       "alt": "Featured Image 1"
   *     },
   *     {
   *       "image": "https://example.com/images/featured2.jpg",
   *       "alt": "Another featured image"
   *     }
   *   ],
   *   "shortDescription": "Latest trends and updates in technology.",
   *   "description": "This Artical covers all the latest news, trends, and innovations in the tech world."
   * }
   *
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Artical"),
    validator.validateRequestBody(articalSchema.Artical, "Artical "),
    Auth,
    checkPermission(["Admin"]),
    articalCtrl.updateArtical
  );

module.exports = router;
