const Joi = require("joi");
const { respondError } = require("../helpers/responseHelper");

const acceptedExtensions = ["json"];

const buildUsefulErrorObject = (errors) => {
  let errorMessage = "";

  errors.map((error, i) => {
    // replace white space and slashes
    if (errors.length === i + 1) {
      errorMessage += `${error.message.replace(/['"]/g, "")}`;
    } else {
      errorMessage += `${error.message.replace(/['"]/g, "")}` + "\n";
    }
  });

  return errorMessage;
};
const buildUsefulErrorForForm = (errors) => {
  let errorList = [];
  errors.map((error, i) => {
    errorList.push({
      key: error.path,
      message: [`${error.message.replace(/['"]/g, "")}`],
    });
  });
  console.log("Errrrrrrrrrrrrrrr", JSON.stringify(errorList));
  return errorList;
};

const validateRequestBody = (schema, title, opt) => (req, res, next) => {
  const options = opt || {
    abortEarly: false,
  };
  const validation = schema.validate(req?.body, options);

  if (validation.error) {
    const errors = validation.error
      ? buildUsefulErrorForForm(validation.error.details)
      : null;
    return respondError(res, 422, "Validator", title, errors);
  }

  if (!req.value) {
    req.value = {};
  }
  req.body = validation.value;
  next();
};

const validateRequestParams = (schema, title, opt) => (req, res, next) => {
  const options = opt || {
    abortEarly: false,
  };

  const validation = schema.validate(req.params, options);
  if (validation.error) {
    const errors = validation.error
      ? buildUsefulErrorForForm(validation.error.details)
      : null;
    return respondError(res, 422, "Validator", title, errors);
  }

  if (!req.value) {
    req.value = {};
  }
  req.params = validation.value;
  next();
};

const validateRequestQuery = (schema, title) => (req, res, next) => {
  const options = {
    abortEarly: false,
  };

  const validation = schema.validate(req.query, options);

  if (validation.error) {
    const errors = validation.error
      ? buildUsefulErrorForForm(validation.error.details)
      : null;
    return respondError(res, 422, "Validator", title, errors);
  }

  if (!req.value) {
    req.value = {};
  }
  req.query = validation.value;
  next();
};

const requireJsonData = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(203).json({
      status: 203,
      message: "Bad Request.",
      error: `Server requires application/json got ${req.headers["content-type"]}`,
      data: [],
    });
  } else {
    next();
  }
};

module.exports = {
  requireJsonData,
  validateRequestQuery,
  validateRequestParams,
  validateRequestBody,
};
