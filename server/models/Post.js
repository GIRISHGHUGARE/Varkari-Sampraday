const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    uploadedPhoto: {
        type: String,
        default: null,
    },
    caption: {
        type: String,
        default: '',
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema);

module.exports = Post