const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
  {
    SN: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
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

    bidLogs: [
      {
        team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        price: Number,
        time: { type: Date, default: Date.now },
      },
    ],

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

PlayerSchema.pre("save", function (next) {
  PlayerSchema.countDocuments({}, (err, count) => {
    if (err) {
      return next(err);
    }

    this.SN = count + 1;
    next();
  });
});

module.exports = mongoose.model("Player", PlayerSchema);
