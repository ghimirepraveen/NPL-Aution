const Admin = require("../../models/userModel");

const allAdmins = async (filter) => {
  let queryArray = [
    {
      $match: {
        isDeleted: { $ne: true },
        userType: { $in: ["Admin"] },
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
          {
            $project: {
              userType: 1,
              status: 1,
              email: 1,
              permission: 1,
              fullName: 1,
              contactNumber: 1,
              createdAt: 1,
            },
          },
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
  const result = await Admin.aggregate(queryArray)
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

const createAdmin = async (data) => {
  const newAdmin = new Admin(data);
  const result = await newAdmin.save();

  return result;
};

const getAdminDetailById = async (id) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminDetailById = async (id, data) => {
  const result = await Admin.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  }).exec();

  return result;
};

module.exports = {
  allAdmins,
  createAdmin,
  getAdminDetailById,
  updateAdminDetailById,
};
