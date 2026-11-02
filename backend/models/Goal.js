const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    goalName: {
      type: String,
      required: true,
      trim: true
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0.01
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);