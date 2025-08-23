const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const resHelp = require("../helpers/responseHelper");

const uploadRootFolder = "./uploads";

const allowedTypes = [
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "image/svg+xml",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir(uploadRootFolder, { recursive: true }, (err) =>
      cb(err, uploadRootFolder)
    );
  },
  filename: function (req, file, cb) {
    const datetimestamp = Date.now();
    cb(
      null,
      (req.query.folder || "file") +
        "-" +
        datetimestamp +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only images, PDF, and SVG are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).single("upload");

async function processAndSaveImage(filePath, mimetype) {
  if (!mimetype.startsWith("image/") || mimetype === "image/svg+xml") return;
  let buffer = fs.readFileSync(filePath);
  let format = "jpeg";
  if (mimetype === "image/png") format = "png";
  if (mimetype === "image/gif") format = "gif";
  if (mimetype === "image/webp") format = "webp";
  let quality = 80;
  let output;
  for (let i = 0; i < 5; i++) {
    output = await sharp(buffer).toFormat(format, { quality }).toBuffer();
    if (output.length <= 210 * 1024) break;
    quality -= 15;
    if (quality < 30) break;
  }
  fs.writeFileSync(filePath, output);
}

function uploadMulter(req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        err = new Error("File size must be less than 2MB");
      }
      return resHelp.respondError(res, 422, "", err.message);
    }
    if (!req.file) {
      return resHelp.respondError(res, 422, "", "No file uploaded");
    }
    try {
      await processAndSaveImage(req.file.path, req.file.mimetype);
      return resHelp.respondSuccess(
        res,
        200,
        "Upload Success",
        "File uploaded",
        {
          filename: req.file.filename,
          path: req.file.path,
        }
      );
    } catch (e) {
      return resHelp.respondError(res, 500, "", "Image processing failed");
    }
  });
}

module.exports = {
  uploadMulter,
  upload,
};
