const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User Registration
const registerUser = async (req, res) => 
{
    const 
    { 
        email, 
        userPassword, 

    } = req.body;
    
    try 
    {
        // User bcrypt Password - Max. 10 Char
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const user = await prisma.users.create({

            data: 
            {
                email: email,
                userPassword: hashedPassword,
            },
        });

        // Successful Registration
        res.status(201).json(user);
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Register User.', details: error.message });
    }
};

// User Login
const loginUser = async (req, res) => 
{
    const 
    { 
        email, 
        userPassword 

    } = req.body;

    try 
    {
        const users = await prisma.users.findUnique({ where: { email } });

        if (users && await bcrypt.compare(userPassword, users.userPassword)) 
        {
            // Token Expiration Time
            const token = jwt.sign({ usersId: users.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Successful Login
            res.status(200).json({ message: 'Successful Login.' });
            res.json({ token });
        }

        else 
        {
            res.status(401).json({ error: 'Invalid Credentials.' });
        }
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Login.', details: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};