const respondSuccess = async (res, statusCode, title, message, data = {}) => {
  res
    .status(statusCode)
    .send({
      title,
      message,
      data,
    })
    .end();
};

const respondError = async (res, statusCode, title, message, errors = []) => {
  res
    .status(statusCode)
    .send({
      title,
      message,
      errors,
    })
    .end();
};

module.exports = {
  respondSuccess,
  respondError,
};
