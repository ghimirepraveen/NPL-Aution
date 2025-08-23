const uploadImageLocal = (req, res, next) => {
  return require("../../helpers/uploadHelper").uploadMulter(req, res, next);
};
module.exports = {
  uploadImageLocal,
};
