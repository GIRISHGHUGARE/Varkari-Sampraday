const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { getfamilyMember, addfamilyMember, deletefamilyMember, updatefamilyMember } = require("../controllers/familyMemberController");

const router = express.Router();
router.get("/get-familyMember", authenticate, getfamilyMember);
router.post("/add-familyMember", authenticate, addfamilyMember);
router.delete("/delete-familyMember/:id", authenticate, deletefamilyMember);
router.put("/update-familyMember/:id", authenticate, updatefamilyMember);

module.exports = router;