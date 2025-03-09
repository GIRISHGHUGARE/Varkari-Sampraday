const express = require("express");
const authenticate = require("../middlewares/authMiddleware"); // Assuming this middleware checks if user is authenticated
const { getCart, addToCart, removeFromCart, updateCart, getBill } = require("../controllers/cartController");

const router = express.Router();

// Routes for Cart CRUD operations
router.get("/get-cart", authenticate, getCart);            // Get the user's cart
router.get("/get-bill", authenticate, getBill);
router.post("/add-to-cart", authenticate, addToCart);      // Add product to cart
router.delete("/remove-from-cart/:productId", authenticate, removeFromCart); // Remove product from cart
router.put("/update-cart/:productId", authenticate, updateCart);  // Update product quantity in cart

module.exports = router;
