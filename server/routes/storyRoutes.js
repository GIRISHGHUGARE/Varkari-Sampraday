const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { getStory, addStory, deleteStory, updateStory } = require("../controllers/storyController");

const router = express.Router();
router.get("/get-story", authenticate, getStory);
router.post("/add-story", authenticate, addStory);
router.delete("/delete-story/:id", authenticate, deleteStory);
router.put("/update-story/:id", authenticate, updateStory);

module.exports = router;