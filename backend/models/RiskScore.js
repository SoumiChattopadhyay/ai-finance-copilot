const mongoose = require("mongoose");

const riskScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    recommendations: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskScore", riskScoreSchema);