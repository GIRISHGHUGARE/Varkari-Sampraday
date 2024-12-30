const jwt = require('jsonwebtoken');

// Middleware to authenticate the user by verifying the JWT token from cookies
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach the decoded user info to the request object
        console.log("decoded user:", req.user)
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticate;
