const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
  {
    SN: {
      type: Number,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
    },

    playingStyle: {
      type: String,
      trim: true,
      enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
    },

    battingStyle: {
      type: String,
      trim: true,
      enum: ["Right-Handed", "Left-Handed"],
    },

    bowlingStyle: {
      type: String,
      trim: true,
      enum: ["Right-Arm", "Left-Arm"],
    },

    bowlingType: {
      type: String,
      trim: true,
      enum: ["Pace", "Spin"],
    },

    stats: {
      type: Object,
      default: {
        matches: 0,
        runs: 0,
        wickets: 0,
        catches: 0,
      },
    },

    category: {
      type: String,
      trim: true,
      enum: ["A", "B", "C"],
    },

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

    baseRate: {
      type: Number,
      default: 0,
    },

    maxRate: {
      type: Number,
      default: 0,
    },

    currentBid: {
      type: Number,
      default: 0,
    },

    bidWinningRate: {
      type: Number,
      default: 0,
    },

    bidWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isBidded: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PlayerSchema.pre("validate", async function () {
  if (!this.SN) {
    const count = await mongoose.model("Player").countDocuments();
    this.SN = count + 1;
  }
});

module.exports = mongoose.model("Player", PlayerSchema);
