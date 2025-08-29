const { default: mongoose } = require("mongoose");

const manageSortOption = (options) => {
  if (!options.sort) {
    options.sort = "createdAt";
  }
  if (!options.dir) {
    options.dir = -1;
  } else {
    options.dir = options.dir === "desc" ? -1 : 1;
  }

  options.page = options.page ? parseInt(options.page) : 1;
  options.limit = options.limit ? parseInt(options.limit) : 10;
  options.search = options.search || "";
  options.id = options.id || "";
  options.min = options.min || 0;
  options.max = options.max || 0;

  options.status = options.status?.split(",").map((x) => x) || [];

  if (options.startDate) {
    const startDate = new Date(options.startDate);
    startDate.setHours(0, 0, 0, 0);
    options.startDate = startDate;
  }

  if (options.endDate) {
    const endDate = new Date(options.endDate);
    endDate.setHours(23, 59, 59, 999);
    options.endDate = endDate;
  }

  options.player =
    options.player?.split(",").map((x) => new mongoose.Types.ObjectId(x)) || [];

  options.createdBy =
    options.createdBy?.split(",").map((x) => new mongoose.Types.ObjectId(x)) ||
    [];

  return options;
};

module.exports = {
  manageSortOption,
};
