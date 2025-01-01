// PACKAGES
const mongoose = require("mongoose");

// CREATE ASYNC FUNCTION TO USE AWAIT WHILE CONNECTING TO MONGODB 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected".bgCyan.white);
    } catch (err) {
        console.error("MongoDB connection error: ".bgRed.white, err);
        process.exit(1);  // EXIT ON FAILURE
    }
};

// EXPORT FUNCTION
module.exports = connectDB;
