const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        req.userId = decoded.userId;
        next();
    });
};

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
    const { name, address } = req.body;
    const user = await prisma.users.update({
        where: { id: req.userId },
        data: { name, address },
    });
    res.json(user);
});

module.exports = router;