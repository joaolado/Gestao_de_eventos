const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, users) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.users = users; // Store the user info in request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
