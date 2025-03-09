const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user; // User is assumed to be added to the request by authenticate middleware
        const cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully!",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId, quantity } = req.body;
        console.log(productId)

        // Validate if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        // Get user's cart or create a new one
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Check if product already in cart, if so, update it
        const existingProduct = cart.products.find(item => item.product.toString() === productId.toString());

        if (existingProduct) {
            // Update the quantity and total
            existingProduct.quantity += quantity;
            existingProduct.total = existingProduct.quantity * product.price;
        } else {
            // Add new product to the cart
            cart.products.push({
                product: productId,
                quantity: quantity,
                price: product.price,
                total: product.price * quantity,
            });
        }

        // Save or update the cart
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully!",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.params;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

// Update product quantity in cart
const updateCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0!"
            });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        // Find the product in the cart and update it
        const productInCart = cart.products.find(item => item.product.toString() === productId.toString());

        if (!productInCart) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart!"
            });
        }

        // Update quantity and total
        productInCart.quantity = quantity;
        productInCart.total = quantity * productInCart.price;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully!",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
}

// Controller for generating the bill
const getBill = async (req, res) => {
    try {
        const userId = req.user; // User is assumed to be added to the request by authenticate middleware
        const cart = await Cart.findOne({ user: userId }).populate("products.product");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        // Calculate the total amount of the cart
        let totalAmount = 0;
        const billDetails = cart.products.map(item => {
            const itemTotal = item.quantity * item.price;
            totalAmount += itemTotal;

            return {
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal
            };
        });

        // Include total in the bill
        const bill = {
            items: billDetails,
            totalAmount: totalAmount
        };

        res.status(200).json({
            success: true,
            message: "Bill generated successfully!",
            bill
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};


module.exports = { getCart, addToCart, removeFromCart, updateCart, getBill };
