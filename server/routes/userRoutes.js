// PACKAGES
const express = require('express');
const { validationResult } = require('express-validator');

// FILES
const { registerUser, verifyEmail, logout, loginUser, resendVerificationEmail, verifyUser, searchUser, updateUser } = require('../controllers/userController');
const userValidationRules = require('../validations/userValidation');
const loginValidationRules = require('../validations/loginValidation');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

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
router.post("/verify-email", authenticate, verifyEmail);
router.post("/resend-otp", authenticate, resendVerificationEmail);
router.post('/login', loginValidationRules, validate, loginUser);
router.get('/verify-user', authenticate, verifyUser);
router.post('/search-user', authenticate, searchUser);
router.put("/update-user", authenticate, updateUser);
router.delete("/logout", logout);

module.exports = router;
