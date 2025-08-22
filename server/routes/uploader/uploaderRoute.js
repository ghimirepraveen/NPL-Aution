// const express = require("express");
// const uploadCtrl = require("../../controllers/uploader/uploaderController");

// const router = express.Router();

// router
//   .route("/initiate-upload")
//   /**
//    * POST /upload/initiate-upload
//    * @tags UPLOAD-FILE
//    * @summary  File upload - initiate upload
//    * @param {object} request.body.required - body object
//    * @return {SuccessObjectResponse} 200 - Success
//    * @return {ErrorResponse} 422 - Unprocessable (invalid input)
//    * @example request -  example payload
//    * {
//    * "key":"abc.jpg",
//    * "folder":"file"
//    * }
//    */
//   .post(uploadCtrl.initateUpload);

// router
//   .route("/generate-presigned-url")
//   /**
//    * POST /upload/generate-presigned-url
//    * @tags UPLOAD-FILE
//    * @summary  File upload - initiate upload
//    * @param {object} request.body.required - body object
//    * @return {SuccessObjectResponse} 200 - Success
//    * @return {ErrorResponse} 422 - Unprocessable (invalid input)
//    * @example request -  example payload
//    * {
//    * "key":"abc.jpg",
//    * "PartNumber":1,
//    * "uploadId":"jCftVG2SzeT_KJ9HqvwdO6HFno30o7E.IK9JmTRr_21jHn54_msUZ2kcNtnjGa_SXnOPRIsotCTk7boru8SirpcN4vGlEyRxDgHpmLhx_lUIheBv1ImUcmof9jCiylOz"
//    * }
//    */
//   .post(uploadCtrl.getS3SignedUrl);

// router
//   .route("/complete-upload")
//   /**
//    * POST /upload/complete-upload
//    * @tags UPLOAD-FILE
//    * @summary  File upload - initiate upload
//    * @param {object} request.body.required - body object
//    * @return {SuccessObjectResponse} 200 - Success
//    * @return {ErrorResponse} 422 - Unprocessable (invalid input)
//    * @example request -  example payload
//    * {
//    * "key":"abc.jpg",
//    * "parts":[
//    * {"ETag":"cb35c4d7d870d272fa67770db2eca778","PartNumber":1}}
//    * ],
//    * "uploadId":"jCftVG2SzeT_KJ9HqvwdO6HFno30o7E.IK9JmTRr_21jHn54_msUZ2kcNtnjGa_SXnOPRIsotCTk7boru8SirpcN4vGlEyRxDgHpmLhx_lUIheBv1ImUcmof9jCiylOz"
//    * }
//    */ .post(uploadCtrl.completeUploads);

// module.exports = router;
