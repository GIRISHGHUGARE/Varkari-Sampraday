const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, logout, loginUser, resendVerificationEmail } = require('../controllers/userController');
const userValidationRules = require('../validations/userValidation');
const { validationResult } = require('express-validator');
const loginValidationRules = require('../validations/loginValidation');

// MIDDLEWARE TO HANDLE ERRORS
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ROUTES
router.post('/register', userValidationRules, validate, registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendVerificationEmail);
router.post('/login', loginValidationRules, validate, loginUser);
router.delete("/logout", logout);

module.exports = router;
