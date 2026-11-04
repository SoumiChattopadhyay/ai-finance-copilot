const mongoose = require("mongoose");
const Transaction = require("../../models/Transaction");
const csv = require("csv-parser");
const { Readable } = require("stream");


// ========================================
// 1. CREATE TRANSACTION
// POST /api/transactions
// ========================================

const createTransaction = async (req, res) => {
    try {
        const {
            amount,
            type,
            category,
            merchant,
            receiver,
            paymentMethod,
            transactionDateTime,
            transactionStatus,
            description
        } = req.body;

        // Validate required fields
        if (
            amount === undefined ||
            !type ||
            !category ||
            !category.type ||
            !category.subcategory ||
            !paymentMethod ||
            !transactionDateTime ||
            !transactionStatus
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required transaction fields."
            });
        }

        // Validate amount
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number."
            });
        }

        // Validate transaction type
        if (!["Credit", "Debit"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type."
            });
        }

        // Validate category type
        if (!["Income", "Expenses"].includes(category.type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category type."
            });
        }

        // Validate category and subcategory combination
        const incomeCategories = [
            "Salary",
            "Freelance",
            "Business",
            "Investment",
            "Other Income"
        ];

        const expenseCategories = [
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

        const allowedCategories =
            category.type === "Income"
                ? incomeCategories
                : expenseCategories;

        if (!allowedCategories.includes(category.subcategory)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory for the selected category."
            });
        }

        // Validate transaction date
        if (isNaN(Date.parse(transactionDateTime))) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction date."
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId: req.user.userId,
            amount,
            type,
            category,
            merchant,
            receiver,
            paymentMethod,
            transactionDateTime,
            transactionStatus,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully.",
            data: transaction
        });

    } catch (error) {
        console.error("Create Transaction Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


// ========================================
// 2. GET ALL USER TRANSACTIONS
// GET /api/transactions
// ========================================

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user.userId
        }).sort({ transactionDateTime: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        console.error("Get Transactions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions."
        });
    }
};


// ========================================
// 3. GET TRANSACTION BY ID
// GET /api/transactions/:id
// ========================================

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID."
            });
        }

        // Find transaction belonging to logged-in user
        const transaction = await Transaction.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (error) {
        console.error("Get Transaction By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transaction."
        });
    }
};


// ========================================
// 4. UPDATE TRANSACTION
// PUT /api/transactions/:id
// ========================================

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID."
            });
        }

        // Only allow fields defined in the transaction schema
        const allowedFields = [
            "amount",
            "type",
            "category",
            "merchant",
            "receiver",
            "paymentMethod",
            "transactionDateTime",
            "transactionStatus",
            "description"
        ];

        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update."
            });
        }

        // Validate amount if provided
        if (
            updateData.amount !== undefined &&
            (typeof updateData.amount !== "number" ||
                updateData.amount <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number."
            });
        }

        // Validate type if provided
        if (
            updateData.type !== undefined &&
            !["Credit", "Debit"].includes(updateData.type)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type."
            });
        }

        // Validate category if provided
        if (updateData.category !== undefined) {
            const { type, subcategory } = updateData.category;

            const incomeCategories = [
                "Salary", "Freelance", "Business",
                "Investment", "Other Income"
            ];

            const expenseCategories = [
                "Food", "Groceries", "Shopping", "Rent",
                "Bills", "Utilities", "Travel",
                "Entertainment", "Healthcare", "Education",
                "Subscription", "Transfer", "Other Expense"
            ];

            if (
                !type ||
                !subcategory ||
                !["Income", "Expenses"].includes(type)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category."
                });
            }

            const allowed =
                type === "Income"
                    ? incomeCategories
                    : expenseCategories;

            if (!allowed.includes(subcategory)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid subcategory."
                });
            }
        }

        if (
            updateData.transactionDateTime !== undefined &&
            isNaN(Date.parse(updateData.transactionDateTime))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction date."
            });
        }

        // Update only the logged-in user's transaction
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.userId
            },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully.",
            data: transaction
        });

    } catch (error) {
        console.error("Update Transaction Error:", error);

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update transaction."
        });
    }
};


// ========================================
// 5. DELETE TRANSACTION
// DELETE /api/transactions/:id
// ========================================

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID."
            });
        }

        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully."
        });

    } catch (error) {
        console.error("Delete Transaction Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete transaction."
        });
    }
};


// ========================================
// 6. CSV UPLOAD
// POST /api/transactions/upload
// ========================================

const uploadTransactions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a CSV file."
            });
        }

        const rows = [];

        // Parse CSV file
        await new Promise((resolve, reject) => {
            Readable.from(req.file.buffer)
                .pipe(csv())
                .on("data", (row) => rows.push(row))
                .on("end", resolve)
                .on("error", reject);
        });

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "CSV file is empty."
            });
        }

        const validTransactions = [];
        const invalidRows = [];

        const requiredColumns = [
            "amount",
            "type",
            "categoryType",
            "subcategory",
            "paymentMethod",
            "transactionDateTime",
            "transactionStatus"
        ];

        // Validate each CSV row
        rows.forEach((row, index) => {
            const rowNumber = index + 2;

            const missingColumns = requiredColumns.filter(
                (column) => !row[column]
            );

            if (missingColumns.length > 0) {
                invalidRows.push({
                    row: rowNumber,
                    reason: `Missing fields: ${missingColumns.join(", ")}`
                });
                return;
            }

            const amount = Number(row.amount);

            if (!Number.isFinite(amount) || amount <= 0) {
                invalidRows.push({
                    row: rowNumber,
                    reason: "Invalid amount."
                });
                return;
            }

            const categoryType = row.categoryType.trim();
            const subcategory = row.subcategory.trim();

            const incomeCategories = [
                "Salary", "Freelance", "Business",
                "Investment", "Other Income"
            ];

            const expenseCategories = [
                "Food", "Groceries", "Shopping", "Rent",
                "Bills", "Utilities", "Travel",
                "Entertainment", "Healthcare", "Education",
                "Subscription", "Transfer", "Other Expense"
            ];

            const allowedCategories =
                categoryType === "Income"
                    ? incomeCategories
                    : categoryType === "Expenses"
                        ? expenseCategories
                        : [];

            if (!allowedCategories.includes(subcategory)) {
                invalidRows.push({
                    row: rowNumber,
                    reason: "Invalid category or subcategory."
                });
                return;
            }

            if (!["Credit", "Debit"].includes(row.type)) {
                invalidRows.push({
                    row: rowNumber,
                    reason: "Invalid transaction type."
                });
                return;
            }

            if (isNaN(Date.parse(row.transactionDateTime))) {
                invalidRows.push({
                    row: rowNumber,
                    reason: "Invalid transaction date."
                });
                return;
            }

            validTransactions.push({
                userId: req.user.userId,
                amount,
                type: row.type,
                category: {
                    type: categoryType,
                    subcategory
                },
                merchant: row.merchant || "",
                receiver: row.receiver || "",
                paymentMethod: row.paymentMethod,
                transactionDateTime: new Date(row.transactionDateTime),
                transactionStatus: row.transactionStatus,
                description: row.description || ""
            });
        });

        let importedTransactions = [];

        if (validTransactions.length > 0) {
            importedTransactions = await Transaction.insertMany(
                validTransactions,
                { ordered: false }
            );
        }

        return res.status(200).json({
            success: true,
            message: "CSV processing completed.",
            importedCount: importedTransactions.length,
            invalidCount: invalidRows.length,
            invalidRows
        });

    } catch (error) {
        console.error("CSV Upload Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process CSV file."
        });
    }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    uploadTransactions
};