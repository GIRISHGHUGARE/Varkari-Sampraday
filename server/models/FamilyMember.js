const mongoose = require("mongoose");

const familyMemberSchema = new monogoose.Schema({
    name: {
        type: String,
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    contactinfo: {
        type: Number,
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
});

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

module.exports = FamilyMember;