const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount:{
        type: Number,
        required: true,
        min: 0.01
    },

    type:{
        type: String,
        enum: ["Credit","Debit"],
        required: true
    },

    category:{
        type: String,
        enum: ["Income", "Expenses"],

        subcategory: {
            type: String,
            enum: [
                "Salary",
                "Freelance",
                "Business",
                "Investment",
                "Other Income",
                "Food",
                "Groceries",
                "Shopping",
                "Rent",
                "Bills",
                "Utilities",
                "Travel",
                "Entertainment",
                "Healthcare",
                "Education",
                "Subscription",
                "Transfer",
                "Other Expense"
            ],
            required: true
        },

        required: true
    },

    merchant: {
        type: String,
        trime: true
    },

    receiver: {
      type: String,
      trim: true
    },

    paymentMethod: {
      type: String,
      enum: [
        "UPI",
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "Net Banking",
        "Cash",
        "Wallet"
      ],
      required: true
    },

    transactionDateTime: {
      type: Date,
      required: true
    },

    transactionStatus: {
      type: String,
      enum: [
        "Success",
        "Pending",
        "Failed",
        "Cancelled",
        "Refunded"
      ],
      required: true
    },

    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true });

module.exports = mongoose.model("Transaction",transactionSchema);