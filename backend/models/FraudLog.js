const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true
    },

    prediction: {
      type: String,
      enum: ["Fraud", "Safe"],
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FraudLog", fraudLogSchema);