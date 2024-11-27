const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => 
{
    // Get Token Authorization
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer Token

    if (!token) 
    {
        return res.status(401).json({ error: 'No Token Provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, users) => 
    {
        if (err) 
        {
            return res.status(403).json({ error: 'Invalid Token' });
        }

        req.users = users; // Store the User info in Request
        next();            // Proceed to the Next Middleware or Route
    });
};

module.exports = authenticateToken;