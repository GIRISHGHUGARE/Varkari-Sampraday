const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { addPost, getPost, deletePost, updatePost, getUserPost } = require("../controllers/postController");

const router = express.Router();
router.get("/get-posts", authenticate, getPost);
router.get("/get-user-posts", authenticate, getUserPost);
router.post("/add-post", authenticate, addPost);
router.delete("/delete-post/:id", authenticate, deletePost);
router.put("/update-post/:id", authenticate, updatePost);

module.exports = router;