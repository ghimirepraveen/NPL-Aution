const router = require("express").Router();
const { Auth } = require("../../middlewares/Auth");
const eventCtrl = require("../../controllers/event/eventController");
const validator = require("../../validation/validator");
const commonSchema = require("../../validation/schemas/commonSchema");
const eventSchema = require("../../validation/schemas/eventSchema");
const { checkPermission } = require("../../middlewares/Guard");

router
  .route("/for-public-completed")

  /**
   * GET /event/for-public-completed
   * @tags EVENTs
   * @security JWT
   * @summary Get Details
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.listingSchema, "Event"),
    eventCtrl.getCompletedEventListForPublic
  );

router
  .route("/for-public-upcomming")

  /**
   * GET /event/for-public-upcomming
   * @tags EVENTs
   * @security JWT
   * @summary Get Details
   * @param {string} search.query - Search
   * @param {number} page.query - 1 by default
   * @param {number} limit.query - 10 by default
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.listingSchema, "Event"),
    eventCtrl.getUpcommingEventListForPublic
  );

router
  .route("/for-public/:slug")

  /**
   * GET /event/for-public/{slug}
   * @tags EVENTs
   * @security JWT
   * @summary Get Details
   * @param {string} slug.path - id (abbabababababaab)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.slugSchema, "Event"),
    eventCtrl.getEventDetailBySlug
  );

router
  .route("/")

  /**
   * GET /event
   * @tags EVENTs
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
    validator.validateRequestQuery(commonSchema.listingSchema, "Event"),
    Auth,
    checkPermission(["Admin"]),
    eventCtrl.getEventListForAdmin
  )

  /**
   * POST /event
   * @tags EVENTs
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
   *   "description": "This Event covers all the latest news, trends, and innovations in the tech world.",
   *   "eventDate":"2078-03-23",
   *  "eventLocation":"kathamndu -16"
   * }
   *
   */
  .post(
    validator.validateRequestBody(eventSchema.Event, "Event"),
    Auth,
    checkPermission(["Admin"]),
    eventCtrl.addEvent
  );

router
  .route("/:id")

  /**
   * GET /event/{id}
   * @tags EVENTs
   * @security JWT
   * @summary Get Details
   * @param {string} id.path - id (5e2583b17e234e3352723427)
   * @return {SuccessObjectResponse} 200 - Success
   * @return {ErrorResponse} 404 - Not Found (invalid id)
   */
  .get(
    validator.validateRequestParams(commonSchema.idSchema, "Event"),
    Auth,
    checkPermission(["Admin"]),
    eventCtrl.getEventDetail
  )

  /**
   * PUT /event/{id}
   * @tags EVENTs
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
   *   "description": "This Event covers all the latest news, trends, and innovations in the tech world.",
   *  "eventDate":"2078-03-23",
   *  "eventLocation":"kathamndu -16"
   * }
   *
   */

  .put(
    validator.validateRequestParams(commonSchema.idSchema, "Event"),
    validator.validateRequestBody(eventSchema.Event, "Event "),
    Auth,
    checkPermission(["Admin"]),
    eventCtrl.updateEvent
  );

module.exports = router;
