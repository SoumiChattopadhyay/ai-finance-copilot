
require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Transaction = require("../models/Transaction");

const sampleTransactions = [
    {
        amount: 1500,
        type: "Debit",
        category: {
            type: "Expenses",
            subcategory: "Food"
        },
        merchant: "Swiggy",
        paymentMethod: "UPI",
        transactionDateTime: new Date("2026-10-25T14:30:00Z"),
        transactionStatus: "Success",
        description: "Food delivery"
    },
    {
        amount: 5000,
        type: "Debit",
        category: {
            type: "Expenses",
            subcategory: "Shopping"
        },
        merchant: "Amazon",
        paymentMethod: "Credit Card",
        transactionDateTime: new Date("2026-10-26T10:15:00Z"),
        transactionStatus: "Success",
        description: "Online shopping"
    },
    {
        amount: 50000,
        type: "Credit",
        category: {
            type: "Income",
            subcategory: "Salary"
        },
        merchant: "ABC Company",
        paymentMethod: "Bank Transfer",
        transactionDateTime: new Date("2026-10-27T09:00:00Z"),
        transactionStatus: "Success",
        description: "Monthly salary"
    },
    {
        amount: 45000,
        type: "Debit",
        category: {
            type: "Expenses",
            subcategory: "Transfer"
        },
        receiver: "Unknown Beneficiary",
        paymentMethod: "UPI",
        transactionDateTime: new Date("2026-10-28T16:45:00Z"),
        transactionStatus: "Pending",
        description: "High-value UPI transfer"
    },
    {
        amount: 800,
        type: "Debit",
        category: {
            type: "Expenses",
            subcategory: "Travel"
        },
        merchant: "Uber",
        paymentMethod: "UPI",
        transactionDateTime: new Date("2026-10-29T08:30:00Z"),
        transactionStatus: "Success",
        description: "Cab fare"
    }
];

const seedTransactions = async () => {
    try {
        const userEmail = process.argv[2];

        if (!userEmail) {
            throw new Error(
                "Please provide a registered user's email address."
            );
        }

        await connectDB();

        const user = await User.findOne({
            email: userEmail.toLowerCase()
        });

        if (!user) {
            throw new Error(
                "User not found. Please register before seeding transactions."
            );
        }

        const transactionsWithUser = sampleTransactions.map(
            transaction => ({
                ...transaction,
                userId: user._id
            })
        );

const operations = transactionsWithUser.map(transaction => ({
    updateOne: {
        filter: {
            userId: user._id,
            description: transaction.description
        },
        update: {
            $set: transaction
        },
        upsert: true
    }
}));

await Transaction.bulkWrite(operations);

        console.log("Sample transactions inserted successfully!");
        console.log(`User: ${user.email}`);
        console.log(`Total sample transactions: ${sampleTransactions.length}`);

    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedTransactions();
