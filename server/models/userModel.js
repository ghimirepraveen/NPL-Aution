const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userType: {
      type: String,
      trim: true,
      enum: ["SuperAdmin", "Admin", "Team"],
    },

    status: {
      type: String,
      trim: true,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
    },

    password: {
      type: String,
      trim: true,
      required: false,
      select: false,
    },

    permission: [
      {
        type: String,
        enum: ["User"],
      },
    ],

    fullName: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },

    image: {
      type: String,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    resetPasswordCode: {
      type: Number,
      default: 0,
    },
    resetPasswordCodeValidTill: {
      type: Date,
    },

    emailVerifyCode: {
      type: Number,
      default: 0,
    },

    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    emailVerifiedAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    budget: {
      type: Number,
      default: 0,
    },

    remainingBudget: {
      type: Number,
      default: 0,
    },

    player: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
