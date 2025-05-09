const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { getProduct, addProduct, deleteProduct, updateProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/get-product", authenticate, getProduct);
router.post("/add-product", authenticate, addProduct);
router.delete("/delete-product/:id", authenticate, deleteProduct);
router.put("/update-product/:id", authenticate, updateProduct);


module.exports = router;