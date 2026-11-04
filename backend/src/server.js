require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("../config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const transactionRoutes = require("./routes/transactionRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/transactions", transactionRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    }
};

// console.log(JSON.stringify(swaggerSpec.paths, null, 2));

startServer();
