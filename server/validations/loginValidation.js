const { body } = require('express-validator');

const loginValidationRules = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username should be at least 3 characters'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

module.exports = loginValidationRules;
