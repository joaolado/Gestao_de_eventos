
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to Verify Token
const authenticateToken = async (req, res, next) => 
{
    try 
    {
        // Get Token from Authorization
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) 
        {
            return res.status(401).json({ error: 'Authorization Missing or Malformed.' });
        }

        // Extract the Token
        const token = authHeader.split(' ')[1];

        // Verify the Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get User from DB
        const dbUser = await prisma.users.findUnique({ 

            where: 
            { 
                id: decoded.usersId 
            } 
        });

        if (!dbUser) 
        {
            return res.status(404).json({ error: 'User not Found' });
        }

        // Attach User to the Request Object
        req.users = dbUser;

        // Proceed to the Next Middleware or Route
        next();
    } 

    // Errors
    catch (err) 
    {
        if (err.name === 'JsonWebTokenError') 
        {
            return res.status(403).json({ error: 'Invalid Token.' });
        }

        if (err.name === 'TokenExpiredError') 
        {
            return res.status(403).json({ error: 'Token Expired.' });
        }

        console.error('Error in authenticateToken Middleware:', err);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = authenticateToken;