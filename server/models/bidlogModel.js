const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidLogSchema = new Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
    },
    increasedAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BidLog", BidLogSchema);
