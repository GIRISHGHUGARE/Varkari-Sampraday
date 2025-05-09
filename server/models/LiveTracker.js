const mongoose = require("mongoose");

const liveTrackerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    currentLocation: {
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const LiveTracker = mongoose.model("LiveTracker", liveTrackerSchema);
module.exports = LiveTracker;
