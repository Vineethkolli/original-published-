const jwt = require('jsonwebtoken');

// Middleware to verify if the user is authenticated
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Middleware to verify if the user has the 'developer' role
const verifyDeveloperRole = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'developer') {
            return res.status(403).json({ message: 'Access forbidden: Developer role required' });
        }
        next();
    });
};

module.exports = { verifyToken, verifyDeveloperRole };
