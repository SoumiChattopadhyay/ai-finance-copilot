
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kriti
 *               email:
 *                 type: string
 *                 example: kriti@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or invalid input
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Registration failed
 */
router.post("/register", registerUser);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: kriti@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token and user details.
 *       400:
 *         description: Missing fields or invalid email
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Login failed
 */
router.post("/login", loginUser);


module.exports = router;
