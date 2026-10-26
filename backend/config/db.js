const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        if(process.env.MONGO_URI){
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB connected successfully.");
        }
        else{
            console.log("MongoDB URI not configured.");
        }

    }catch(err){
        console.error("MongoDB connection failed:",err.message);
    }
}

module.exports = connectDB;