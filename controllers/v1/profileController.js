const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Updates Users by ID (Respective Authenticated User Only)
exports.profile = async (req, res) => 
{
    const 
    { 
        userName, 
        userPassword, 
        firstName, 
        lastName, 
        phone, 
        email, 

        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,

    } = req.body;

    try 
    {
        // Get User ID from Token Payload (req.users is set by authenticateToken Middleware)
        const userId = req.users.usersId;

        // Hash the New Password if Provided
        const hashedPassword = userPassword ? await bcrypt.hash(userPassword, 10) : undefined;

        // Update the User profile
        const updatedUsers = await prisma.users.update({

            where: 
            { 
                id: userId // Use userId from the Token
            }, 

            data: 
            {
                userName,
                userPassword: hashedPassword || undefined, // Update only if Password is Provided
                firstName,
                lastName,
                phone,
                email,

                // Create or Update the Address
                address: {
                    upsert: 
                    { 
                        create: 
                        {
                            addressLine1,
                            addressLine2,
                            postalCode,
                            city,
                            region,
                            country,
                        },

                        update: 
                        {
                            addressLine1,
                            addressLine2,
                            postalCode,
                            city,
                            region,
                            country,
                        },
                    },
                },
            },

            include: 
            { 
                address: true 
            },
        });

        // Return the Updated User Profile
        res.status(200).json({message: 'User Profile Updated Successfully: ', updatedUsers });

    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Profile.', details: error.message });
    }
};