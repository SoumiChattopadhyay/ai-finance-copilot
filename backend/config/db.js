const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try {
        await mongoose.connect(mongoURI,{
            dbName: "finance_copilot_db"
        });
        console.log("MongoDB connected successfully.");
    } catch (error) {
        throw new Error("MongoDB connection failed:", error.message);
    }
};

module.exports = connectDB;