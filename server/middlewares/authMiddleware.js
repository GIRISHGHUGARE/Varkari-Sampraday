//PACKAGES
const jwt = require('jsonwebtoken');

//MIDDLEWARE TO HANDLE AUTHENTICATION TO VERIFY JWT TOKEN 
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // GET THE TOKEN FROM AUTHORIZATION HEADERS
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // NOTE:- userId IS BEING PASSED AHEAD!!  
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticate;
