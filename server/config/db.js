const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected".bgCyan.white);
    } catch (err) {
        console.error("MongoDB connection error: ".bgRed.white, err);
        process.exit(1);  // Exit on failure
    }
};

module.exports = connectDB;
