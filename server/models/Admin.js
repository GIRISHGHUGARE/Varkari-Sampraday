// PACKAGES
const mongoose = require('mongoose');

// FILES
const User = require('./User');

// SCHEMA DEFINITION (EXTENDED BY USER MODEL)
const adminSchema = new mongoose.Schema({
    permissions: {
        type: [String], // ARRAY OF PERMISSIONS FOR ADMIN (e.g., ['manage-users', 'view-reports'])
        default: ['manage-users'], // DEFAULT PERMISSION
    },
}, {
    timestamps: true,
});

// CREATE ADMIN MODEL THAT EXTENDS USER MODEL
const Admin = User.discriminator('Admin', adminSchema);

// EXPORT ADMIN MODEL
module.exports = Admin;
