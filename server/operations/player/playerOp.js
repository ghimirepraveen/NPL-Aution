const Player = require("../../models/playerModel");

const allPlayers = async (filter) => {
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
  const result = await Player.aggregate(queryArray)
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

const createPlayer = async (data) => {
  const newPlayer = new Player(data);
  const result = await newPlayer.save();

  return result;
};

const getPlayerDetailById = async (id) => {
  const result = await Player.findById(id);
  return result;
};

const updatePlayerDetailById = async (id, data) => {
  const result = await Player.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  }).exec();

  return result;
};
const findPlayerByEmail = async (email) => {
  const result = await Player.findOne({ email });
  return result;
};

const findListOfPlayerForaTeam = async (team) => {
  const result = await Player.find({
    bidWinner: team,
  });
  return result;
};

module.exports = {
  allPlayers,
  createPlayer,
  getPlayerDetailById,
  updatePlayerDetailById,
  findPlayerByEmail,
  findListOfPlayerForaTeam,
};
