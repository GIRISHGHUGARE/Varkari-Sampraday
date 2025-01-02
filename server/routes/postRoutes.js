const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { addPost, getPost } = require("../controllers/postController");

const router = express.Router();
router.get("/get-posts", authenticate, getPost);
router.post("/add-post", authenticate, addPost);

module.exports = router;