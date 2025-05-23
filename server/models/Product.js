// PACKAGES
const mongoose = require('mongoose');

// SCHEMA DEFINITION
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    productPhoto: {
        type: String, // URL OF PROFILE PHOTO
        default: null,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;