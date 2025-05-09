const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    storyPhoto: {
        type: String,
        default: null,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);

module.exports = Story