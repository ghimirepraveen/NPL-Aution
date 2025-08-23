const User = require("../../models/userModel");

const AllUsers = async (filter) => {
  const result = await User.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        userType: { $in: ["User"] },
        $or: [{ fullName: { $regex: filter?.search, $options: "si" } }],
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
              status: 1,
              email: 1,
              contactNumber: 1,
              dob: 1,
              shippingAddress: 1,
              billingAddress: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
  ])
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

const allAdmins = async (filter) => {
  const result = await User.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        userType: { $in: ["Admin"], $nin: ["SuperAdmin"] },
        $or: [{ fullName: { $regex: filter?.search, $options: "si" } }],
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
              image: 1,
              status: 1,
              email: 1,
              contactNumber: 1,
              permissions: 1,
              createdAt: 1,
              title: 1,
            },
          },
        ],
      },
    },
  ])
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
  const result = await User.findById(id);
  return result;
};

const updateUserDetails = async (id, data) => {
  const result = await User.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  }).exec();

  return result;
};

const updateUser = async (query, data) => {
  const result = await User.findOneAndUpdate(query, data, {
    new: true,
  });
  return result;
};

const deleteUser = async (id) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { upsert: true, new: true }
  );
  return result;
};

const updateUserDetailSetIncDec = async (id, setData, incDec) => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: setData,
      $inc: incDec,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
  return result;
};

const getRiders = async () => {
  const result = await User.find({
    userType: "Rider",
    isDeleted: { $ne: true },
  }).distinct("_id");
  return result;
};

const getUserCount = async (userType) => {
  const result = await User.countDocuments(userType);
  return result;
};

module.exports = {
  AllUsers,
  allAdmins,

  createUser,
  getUserDetails,
  updateUserDetails,
  updateUser,
  deleteUser,

  updateUserDetailSetIncDec,
  getRiders,
  getUserCount,
};
