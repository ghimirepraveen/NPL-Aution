const User = require("../../models/userModel");

const AllUsers = async (filter) => {
  let queryArray = [
    {
      $lookup: {
        from: "addresses",
        localField: "province",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "province",
      },
    },
    {
      $unwind: {
        path: "$province",
        includeArrayIndex: "a",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "district",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "district",
      },
    },
    {
      $unwind: {
        path: "$district",
        includeArrayIndex: "b",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "municipality",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "municipality",
      },
    },
    {
      $unwind: {
        path: "$municipality",
        includeArrayIndex: "c",
        preserveNullAndEmptyArrays: false,
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
          //{
          // $project: {
          //   fullName: 1,
          //   email: 1,
          //   contactNumber: 1,
          //   province: 1,
          //   district: 1,
          //   municipality: 1,
          //   bloodGroup: 1,
          //   isAvailable: 1,
          // },
          //},
        ],
      },
    },
  ];

  let matchStage = {
    isDeleted: { $ne: true },
    userType: { $in: ["User"] },
  };

  if (filter?.province?.length > 0) {
    matchStage.province = { $in: filter.province };
  }

  if (filter?.district?.length > 0) {
    matchStage.district = { $in: filter.district };
  }

  if (filter?.municipality?.length > 0) {
    matchStage.municipality = { $in: filter.municipality };
  }

  if (filter?.bloodGroup?.length > 0) {
    matchStage.bloodGroup = { $in: [filter.bloodGroup] };
  }

  if (filter?.search) {
    matchStage.$or = [{ fullName: { $regex: filter.search, $options: "si" } }];
  }

  queryArray.unshift({ $match: matchStage });

  const result = await User.aggregate(queryArray)
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

const AllDonorForPublic = async (filter) => {
  let queryArray = [
    {
      $lookup: {
        from: "addresses",
        localField: "province",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "province",
      },
    },
    {
      $unwind: {
        path: "$province",
        includeArrayIndex: "a",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "district",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "district",
      },
    },
    {
      $unwind: {
        path: "$district",
        includeArrayIndex: "b",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "municipality",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "municipality",
      },
    },
    {
      $unwind: {
        path: "$municipality",
        includeArrayIndex: "c",
        preserveNullAndEmptyArrays: false,
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
          {
            $project: {
              fullName: 1,
              email: 1,
              province: 1,
              district: 1,
              municipality: 1,
              bloodGroup: 1,
              isAvailable: 1,
            },
          },
        ],
      },
    },
  ];

  let matchStage = {
    isDeleted: { $ne: true },
    userType: { $in: ["User"] },
  };

  if (filter?.province?.length > 0) {
    matchStage.province = { $in: filter.province };
  }

  if (filter?.district?.length > 0) {
    matchStage.district = { $in: filter.district };
  }

  if (filter?.municipality?.length > 0) {
    matchStage.municipality = { $in: filter.municipality };
  }

  if (filter?.bloodGroup?.length > 0) {
    matchStage.bloodGroup = { $in: [filter.bloodGroup] };
  }

  queryArray.unshift({ $match: matchStage });

  const result = await User.aggregate(queryArray)
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

const AllDonorForUser = async (filter) => {
  let queryArray = [
    {
      $lookup: {
        from: "addresses",
        localField: "province",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "province",
      },
    },
    {
      $unwind: {
        path: "$province",
        includeArrayIndex: "a",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "district",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "district",
      },
    },
    {
      $unwind: {
        path: "$district",
        includeArrayIndex: "b",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "municipality",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "municipality",
      },
    },
    {
      $unwind: {
        path: "$municipality",
        includeArrayIndex: "c",
        preserveNullAndEmptyArrays: false,
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
          {
            $project: {
              fullName: 1,
              email: 1,
              contactNumber: 1,
              province: 1,
              district: 1,
              municipality: 1,
              bloodGroup: 1,
              isAvailable: 1,
            },
          },
        ],
      },
    },
  ];

  let matchStage = {
    isDeleted: { $ne: true },
    userType: { $in: ["User"] },
  };

  if (filter?.province?.length > 0) {
    matchStage.province = { $in: filter.province };
  }

  if (filter?.district?.length > 0) {
    matchStage.district = { $in: filter.district };
  }

  if (filter?.municipality?.length > 0) {
    matchStage.municipality = { $in: filter.municipality };
  }

  if (filter?.bloodGroup?.length > 0) {
    matchStage.bloodGroup = { $in: [filter.bloodGroup] };
  }

  if (filter?.search) {
    matchStage.$or = [{ fullName: { $regex: filter.search, $options: "si" } }];
  }

  queryArray.unshift({ $match: matchStage });

  const result = await User.aggregate(queryArray)
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

const createUser = async (data) => {
  const newUser = new User(data);
  const result = await newUser.save();
  return result;
};

const getUserDetails = async (id) => {
  const result = await User.findById(id)
    .populate({
      path: "province",
      select: "name",
    })
    .populate({
      path: "district",
      select: "name",
    })
    .populate({
      path: "municipality",
      select: "name",
    });
  return result;
};

const updateUserDetails = async (id, data) => {
  const result = await User.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  }).exec();

  return result;
};

const userCount = async (data) => {
  const result = await User.find(data).countDocuments();
  return result;
};

const userAvilable = async () => {
  const result = await User.aggregate([
    {
      $match: {
        userType: "User",
        isAvailable: true,
      },
    },
    {
      $group: {
        _id: "$bloodGroup",
        totalCount: {
          $sum: 1,
        },
      },
    },
  ]);
  return result;
};

module.exports = {
  AllUsers,

  createUser,
  getUserDetails,
  updateUserDetails,
  AllDonorForPublic,
  AllDonorForUser,
  userCount,
  userAvilable,
  //updateUser,
};
