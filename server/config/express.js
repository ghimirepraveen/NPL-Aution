const express = require("express");
const path = require("path");

const fs = require("fs");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("../routes/indexRoute");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const expressJSDocSwagger = require("express-jsdoc-swagger");

const options = {
  info: {
    version: "1.0.0",
    title: "Test API",
    description: "Test API Documentation",
  },
  security: {
    JWT: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "JWT Token",
    },
  },

  servers: [
    {
      url: `${process.env.API_SERVER}`,
    },
  ],
  baseDir: __dirname,

  filesPattern: ["./../routes/*/*.js"],
  swaggerUIPath: "/api-docs",
};

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  expressJSDocSwagger(app)(options);
}
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    // res.header("Access-Control-Expose-Headers", "accessToken");
    res.header("Access-Control-Allow-Methods", "PATCH, PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  if (["PATCH", "POST", "PUT"].includes(req.method)) {
    if (req.is("application/json") || req.is("multipart/form-data")) {
      return next();
    } else {
      res
        .status(422)
        .send({
          title: "Content Type",
          message: "Content Type not Accepted!",
        })
        .end();
    }
  } else if (["DELETE", "GET"].includes(req.method)) {
    return next();
  } else {
    res
      .status(422)
      .send({
        title: "Methods",
        message: "Method not allowed!",
      })
      .end();
  }
});

app.use("/api/", routes);
app.use("*", (req, res) => {
  res
    .status(404)
    .send({
      title: "Api",
      message: "Api path not found",
    })
    .end();
});

app.use((err, req, res, next) => {
  console.log(err);
  let today = new Date();
  let year = today.getUTCFullYear().toString();
  let month = (today.getUTCMonth() + 1).toString();
  let day = today.getUTCDate().toString();

  let folderPath = path.join(__dirname, "..", "..", "logs", year, month);
  let filePath = path.join(folderPath, day + ".log");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, {
      recursive: true,
    });
  }

  fs.appendFile(
    filePath,
    today.toISOString() + "-" + err + "\n",
    {
      flag: "a+",
    },
    (err) => {
      if (err) {
        console.error("Error while trying to write to log file:", err);
      }
    }
  );
  next();
});

module.exports = app;
