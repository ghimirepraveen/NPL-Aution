const express = require("express");

const uploadCtrl = require("../../controllers/uploader/uploaderController");

const router = express.Router();

router.post("/local-image", uploadCtrl.uploadImageLocal);

module.exports = router;
