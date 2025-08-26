const Bidlog = require("../../models/bidlogModel");

const allBidlogs = async (filter) => {
  let queryArray = [
    {
      $match: {
        isDeleted: { $ne: true },
        $or: [
          { uniCode: { $regex: filter?.search, $options: "si" } },
          { contactNumber: { $regex: filter?.search, $options: "si" } },
          { fullName: { $regex: filter?.search, $options: "si" } },
        ],
      },
    },

    {
      $facet: {
        pagination: [
          { $count: "total" },
          { $addFields: { page: parseInt(filter.page) } },
          { $addFields: { limit: parseInt(filter.limit) } },
          {
            $addFields: {
              perviousPage: {
                $cond: {
                  if: {
                    $ne: [parseInt(filter.page), 1],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $addFields: {
              nextPage: {
                $cond: {
                  if: {
                    $gt: [
                      "$total",
                      parseInt(filter.page) * parseInt(filter.limit),
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
        ],
        docs: [
          {
            $sort: {
              [filter.sort]: filter.dir,
            },
          },
          {
            $skip: (parseInt(filter.page) - 1) * parseInt(filter.limit),
          },
          {
            $limit: parseInt(filter.limit),
          },
          // {
          //   $project: {
          //     userType: 1,
          //     status: 1,
          //     email: 1,
          //     permission: 1,
          //     fullName: 1,
          //     contactNumber: 1,
          //     createdAt: 1,
          //   },
          // },
        ],
      },
    },
  ];
  if (filter?.status?.length > 0) {
    queryArray.unshift({
      $match: {
        status: { $in: filter.status },
      },
    });
  }
  const result = await Bidlog.aggregate(queryArray)
    .allowDiskUse(true)
    .collation({ locale: "en" });

  const desiredDocs = result[0].docs ? result[0].docs : [];
  const pagination =
    result[0].pagination && result[0].pagination[0] !== undefined
      ? result[0].pagination[0]
      : {
          total: 0,
          page: parseInt(filter.page),
          limit: parseInt(filter.limit),
          nextPage: false,
          perviousPage: false,
        };
  return { pagination: pagination, docs: desiredDocs };
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
