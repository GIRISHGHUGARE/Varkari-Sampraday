const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Middleware to authenticate the user by verifying the JWT token from cookies
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies (assuming your cookie is named 'token')

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach the decoded user info to the request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticate;
