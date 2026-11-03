
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const validTransaction = {
    userId: new mongoose.Types.ObjectId(),
    amount: 1500,
    type: "Debit",
    category: {
        type: "Expenses",
        subcategory: "Food"
    },
    merchant: "Swiggy",
    paymentMethod: "UPI",
    transactionDateTime: new Date("2026-11-01T10:00:00Z"),
    transactionStatus: "Success",
    description: "Food delivery"
};

const testCases = [
    {
        name: "Valid transaction",
        data: {},
        shouldPass: true
    },
    {
        name: "Missing amount",
        data: { amount: undefined },
        shouldPass: false
    },
    {
        name: "Zero amount",
        data: { amount: 0 },
        shouldPass: false
    },
    {
        name: "Negative amount",
        data: { amount: -100 },
        shouldPass: false
    },
    {
        name: "Invalid transaction type",
        data: { type: "Transfer" },
        shouldPass: false
    },
    {
        name: "Invalid category type",
        data: {
            category: {
                type: "Other",
                subcategory: "Food"
            }
        },
        shouldPass: false
    },
    {
        name: "Invalid subcategory",
        data: {
            category: {
                type: "Expenses",
                subcategory: "Gaming"
            }
        },
        shouldPass: false
    },
    {
        name: "Invalid payment method",
        data: { paymentMethod: "Crypto" },
        shouldPass: false
    },
    {
        name: "Missing transaction date",
        data: { transactionDateTime: undefined },
        shouldPass: false
    },
    {
        name: "Invalid transaction status",
        data: { transactionStatus: "Completed" },
        shouldPass: false
    },
    {
        name: "Invalid user ID",
        data: { userId: "invalid-id" },
        shouldPass: false
    },
    {
        name: "Invalid category-subcategory combination",
        data: {
            category: {
                type: "Income",
                subcategory: "Food"
            }
        },
        shouldPass: false
    }
];

const runTests = async () => {
    let passed = 0;
    let failed = 0;

    console.log("\nTRANSACTION FIELD VALIDATION RESULTS\n");

    for (const test of testCases) {
        const transaction = new Transaction({
            ...validTransaction,
            ...test.data
        });

        let actualPass = true;
        let validationError = null;

        try {
            await transaction.validate();
        } catch (error) {
            actualPass = false;
            validationError = error;
        }

        const success = actualPass === test.shouldPass;

        if (success) {
            passed++;
            console.log(`PASS: ${test.name}`);
        } else {
            failed++;
            console.log(`FAIL: ${test.name}`);

            if (validationError) {
                console.log(validationError.message);
            }
        }
    }

    console.log("\n--------------------------------");
    console.log(`Total tests: ${testCases.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("--------------------------------\n");
};

runTests().catch(error => {
    console.error("Test execution failed:", error);
    process.exitCode = 1;
});
