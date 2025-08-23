const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TokenSchema = new Schema(
  {
    token: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tokenType: {
      type: String,
      trim: true,
      required: true,
      default: "accessToken",
    },
    isUsed: {
      type: Boolean,
      default: false,
    },

    expireAfter: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

TokenSchema.index({ expireAfter: 1 }, { expireAfterSeconds: 30 }); //30 second more

module.exports = mongoose.model("Token", TokenSchema);
