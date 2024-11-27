const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User registration
const registerUser = async (req, res) => {
    const 
    { 
        email, 
        userPassword, 

    } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await prisma.users.create({
            data: 
            {
                email,
                userPassword: hashedPassword,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to Register user.', details: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, userPassword } = req.body;
    try {
        const users = await prisma.users.findUnique({ where: { email } });
        if (users && await bcrypt.compare(userPassword, users.userPassword)) {
            const token = jwt.sign({ usersId: users.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Failed to Login.', details: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};