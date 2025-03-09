// PACKAGES
const mongoose = require('mongoose');

// SCHEMA DEFINITION
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Prevents adding 0 or negative quantities
        },
        price: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// CREATE CART MODEL
const Cart = mongoose.model('Cart', cartSchema);

// EXPORT CART MODEL
module.exports = Cart;
