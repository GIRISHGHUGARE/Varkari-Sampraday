const mongoose = require('mongoose');
const User = require('./User');  // Regular User model

// Define the Admin schema (can extend the User model)
const adminSchema = new mongoose.Schema({
    permissions: {
        type: [String], // Array of permissions for the admin (e.g., ['manage-users', 'view-reports'])
        default: ['manage-users'], // Default permission for admins
    },
}, {
    timestamps: true,
});

// Create and export the Admin model that extends User
const Admin = User.discriminator('Admin', adminSchema);
module.exports = Admin;
