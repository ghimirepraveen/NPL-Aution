const User = require("../../models/userModel");

const alreadyExist = async (email) => {
  const result = await User.findOne({
    email,
  });
  return result;
};

const findUserByEmailWithPassword = async (email) => {
  const result = await User.findOne({
    email,
    isDeleted: false,
    // status: "Active",
  }).select("+password");
  return result;
};

const findUserByEmail = async (email) => {
  const result = await User.findOne({ email });
  return result;
};

const createUser = async (data) => {
  data.emailVerifyCode = await Math.floor(100000 + Math.random() * 900000);
  const newUser = new User(data);
  const result = await newUser.save();
  return result;
};

const updateUserProfileById = async (id, data) => {
  const result = await User.findByIdAndUpdate(id, data, {
    upsert: true,
    new: true,
  });
  return result;
};

const getUserDetails = async (id) => {
  const result = await User.findById(id);

  return result;
};

module.exports = {
  alreadyExist,
  findUserByEmailWithPassword,
  findUserByEmail,
  createUser,
  updateUserProfileById,
  getUserDetails,
};
