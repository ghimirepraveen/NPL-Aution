const resHelp = require("../helpers/responseHelper");

const checkPermission = (userType) => {
  return (req, res, next) => {
    if (req.user.userType == "SuperAdmin") {
      next();
    } else if (req.user.userType == "Admin" && userType.includes("Admin")) {
      next();
    } else if (req.user.userType == "Team" && userType.includes("Team")) {
      next();
    } else {
      resHelp.respondError(res, 403, "Role", "Not Allowed!");
    }
  };
};

module.exports = {
  checkPermission,
};
