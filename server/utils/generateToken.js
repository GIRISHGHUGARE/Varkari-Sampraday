const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ user: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
