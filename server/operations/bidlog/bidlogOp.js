const Bidlog = require("../../models/bidLogModel");

const allBidlogs = async (filter) => {
  let queryArray = [
    {
      $match: {
        isDeleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "team",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              fullName: 1,
            },
          },
        ],
        as: "team",
      },
    },
    {
      $unwind: {
        path: "$team",
        includeArrayIndex: "q",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (filter?.player) {
    queryArray.push({
      $match: {
        player: { $in: filter.player },
      },
    });
  }

  const result = await Bidlog.aggregate(queryArray)
    .allowDiskUse(true)
    .collation({ locale: "en" });

  return result;
};

const createBidlog = async (data) => {
  const newBidlog = new Bidlog(data);
  const result = await newBidlog.save();

  return result;
};

const getBidlogDetailById = async (id) => {
  const result = await Bidlog.findById(id);
  return result;
};

const updateBidlogDetailById = async (id, data) => {
  const result = await Bidlog.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  }).exec();

  return result;
};
const findBidlogByEmail = async (email) => {
  const result = await Bidlog.findOne({ email });
  return result;
};

module.exports = {
  allBidlogs,
  createBidlog,
  getBidlogDetailById,
  updateBidlogDetailById,
  findBidlogByEmail,
};
