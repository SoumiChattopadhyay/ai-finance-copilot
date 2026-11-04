
const express = require("express");
const multer = require("multer");

const router = express.Router();

// Authentication middleware
const verifyToken = require("../middleware/authMiddleware");
// Protect ALL transaction routes
router.use(verifyToken);

// Transaction controllers
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    uploadTransactions
} = require("../controllers/transactionController");


// ========================================
// MULTER CONFIGURATION FOR CSV UPLOAD
// ========================================

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },

    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/csv"
        ];

        const isCSVExtension = file.originalname
            .toLowerCase()
            .endsWith(".csv");

        const isAllowedMimeType = allowedMimeTypes.includes(
            file.mimetype
        );

        if (!isCSVExtension || !isAllowedMimeType) {
            return cb(new Error("Only CSV files are allowed."));
        }

        cb(null, true);
    }
});


// ========================================
// SWAGGER DOCUMENTATION
// ========================================

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - amount
 *         - type
 *         - category
 *         - paymentMethod
 *         - transactionDateTime
 *         - transactionStatus
 *       properties:
 *         amount:
 *           type: number
 *           example: 1500
 *         type:
 *           type: string
 *           enum: [Credit, Debit]
 *           example: Debit
 *         category:
 *           type: object
 *           required:
 *             - type
 *             - subcategory
 *           properties:
 *             type:
 *               type: string
 *               enum: [Income, Expenses]
 *               example: Expenses
 *             subcategory:
 *               type: string
 *               example: Food
 *         merchant:
 *           type: string
 *           example: Amazon
 *         receiver:
 *           type: string
 *           example: Rahul
 *         paymentMethod:
 *           type: string
 *           enum: [UPI, Credit Card, Debit Card, Bank Transfer, Net Banking, Cash, Wallet]
 *           example: UPI
 *         transactionDateTime:
 *           type: string
 *           format: date-time
 *           example: "2026-11-04T10:30:00.000Z"
 *         transactionStatus:
 *           type: string
 *           enum: [Success, Pending, Failed, Cancelled, Refunded]
 *           example: Success
 *         description:
 *           type: string
 *           example: Grocery shopping
 */


// ========================================
// 1. CREATE TRANSACTION
// POST /api/transactions
// ========================================

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid transaction data
 *       401:
 *         description: Unauthorized
 */
router.post("/", createTransaction);


// ========================================
// 2. GET ALL USER TRANSACTIONS
// GET /api/transactions
// ========================================

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions of the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getTransactions);


// ========================================
// 3. GET TRANSACTION BY ID
// GET /api/transactions/:id
// ========================================

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction MongoDB ID
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 *       400:
 *         description: Invalid transaction ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get("/:id", getTransactionById);


// ========================================
// 4. UPDATE TRANSACTION
// PUT /api/transactions/:id
// ========================================

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Invalid transaction data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put("/:id", updateTransaction);


// ========================================
// 5. DELETE TRANSACTION
// DELETE /api/transactions/:id
// ========================================

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction MongoDB ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       400:
 *         description: Invalid transaction ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", deleteTransaction);


// ========================================
// 6. CSV UPLOAD
// POST /api/transactions/upload
// ========================================

/**
 * @swagger
 * /api/transactions/upload:
 *   post:
 *     summary: Upload transactions using a CSV file
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing transaction records
 *     responses:
 *       200:
 *         description: CSV processed successfully
 *       400:
 *         description: Invalid CSV file
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/upload",
    upload.single("file"),
    uploadTransactions
);


module.exports = router;