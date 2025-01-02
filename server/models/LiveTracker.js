const mongoose = require("mongoose");

const liveTrackerSchema = new mongoose.Schema({
    currentlocation: {
        type: String,
        required: true,
    },
    route: {

    },
    nearbyfacilities: {

    },
})