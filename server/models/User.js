const mongoose = require('mongoose');

// Define the schema for the user (including admins)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure username is unique
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure the email is unique
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String, // URL or path to the profile photo
        default: null,
    },
    summary: {
        type: String,
        default: '', // Optional field for bio or summary
    },
    isVerified: {
        type: Boolean,
        default: false, // User email verification status
    },
    isAdmin: {
        type: Boolean,
        default: false, // Flag to indicate if the user is an admin
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    otpResendCount: { type: Number, default: 0 },
    otpResendTimestamp: { type: Date }, // Track the last time OTP was resent
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
