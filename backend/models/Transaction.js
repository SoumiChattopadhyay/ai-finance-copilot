
const mongoose = require('mongoose');

// Allowed Income subcategories
const incomeSubcategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Other Income"
];

// Allowed Expense subcategories
const expenseSubcategories = [
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
];

// Category subdocument schema
const categorySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Income", "Expenses"],
            required: true
        },
        subcategory: {
            type: String,
            enum: [
                ...incomeSubcategories,
                ...expenseSubcategories
            ],
            required: true
        }
    },
    { _id: false }
);

// Validate that the subcategory belongs to the selected category
categorySchema.pre("validate", function () {
    if (
        this.type === "Income" &&
        !incomeSubcategories.includes(this.subcategory)
    ) {
        this.invalidate(
            "subcategory",
            "This subcategory is not valid for Income"
        );
    }

    if (
        this.type === "Expenses" &&
        !expenseSubcategories.includes(this.subcategory)
    ) {
        this.invalidate(
            "subcategory",
            "This subcategory is not valid for Expenses"
        );
    }
});

// Main Transaction schema
const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        type: {
            type: String,
            enum: ["Credit", "Debit"],
            required: true
        },

        category: {
            type: categorySchema,
            required: true
        },

        merchant: {
            type: String,
            trim: true
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
    {
        timestamps: true
    }
);

// Export Transaction model
module.exports = mongoose.model("Transaction", transactionSchema);
