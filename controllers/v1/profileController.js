
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Get User Profile by ID (Respective Authenticated User Only) (Token)
exports.getProfile = async (req, res) => 
{
    try 
    {   
        // Get User ID from Token
        const userId = req.users.id;
        
        // Find User by ID
        const response = await prisma.users.findUnique({

            where: 
            { 
                id: userId // Use userId from the Token
            }, 

            select: 
            {   
                profilePic: true,
                userName: true,
                userPassword: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,

                // Include related User Address
                address: 
                { 
                    select:
                    {   
                        addressLine1: true, 
                        addressLine2: true,
                        postalCode: true,
                        city: true,
                        region: true,
                        country: true,
                    }, 
                },
            } 
        });

        // Return Profile
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Profile Not Found.', details: error.message });
    }
};

// Edit User by ID (Respective Authenticated User Only) (Token)
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
        // Get User ID from Token
        const userId = req.users.id;

        // Hash the New Password if Provided
        const hashedPassword = userPassword ? await bcrypt.hash(userPassword, 10) : undefined;

        // Check if a File is Uploaded
        const profilePic = req.file ? req.file.filename : null;

        // Check if address already exists for the user
        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { address: true },
        });

        // If address exists, update it; otherwise, create a new one
        const addressData = user.address ? {
            update: {
                addressLine1,
                addressLine2,
                postalCode,
                city,
                region,
                country,
            },
        } : {
            create: {
                addressLine1,
                addressLine2,
                postalCode,
                city,
                region,
                country,
            },
        };

        // Update the User profile
        const updatedUsers = await prisma.users.update({

            where: 
            { 
                id: userId, // Use userId from the Token
            }, 

            data: 
            {   
                profilePic: profilePic,
                userName: userName,
                userPassword: hashedPassword || undefined, // Update only if Password is Provided
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,

                // Create or Update the Address
                address: addressData,
            },

            include: 
            { 
                address: true 
            },
        });

        // Return the Updated User Profile
        res.status(200).json({ success: true, message: 'User Profile Updated Successfully: ', updatedUsers });

    } 

    catch (error) 
    {
        res.status(400).json({ success: false, error: 'Failed to Update Profile.', details: error.message });
    }
};

// Get User Wishlist by ID (Respective Authenticated User Only) (Token)
exports.getWishlist = async (req, res) => 
{
    try 
    {   
        // Get User ID from Token
        const userId = req.users.id;
        
        // Find User by ID
        const response = await prisma.users.findUnique({

            where: 
            { 
                id: userId, // Use userId from the Token
            }, 

            select: 
            {       
                wishlist:
                {
                    select:
                    { 
                        event: 
                        { 
                            select: 
                            { 
                                id: true,
                                name: true,
                                startDate: true,
                                endDate: true,
                            }       
                        },
                    },          
                },
            } 
        });

        // Return Wishlist
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Wishlist Not Found.', details: error.message });
    }
};

// Add Event to User Wishlist (Respective Authenticated User Only) (Token)
exports.addToWishlist = async (req, res) => 
{
    const 
    {  
        eventId,
    
    } = req.body;

    try 
    {
        // Get User ID from Token
        const userId = req.users.id;

        // Check if the Event is Already in the Wishlist
        const existingWishlistItem = await prisma.usersWishlist.findFirst({

            where: 
            {
                userId: userId,
                eventId: eventId,
            },
        });

        if (existingWishlistItem) 
        {
            return res.status(400).json({ error: 'Event is Already in the Wishlist.' });
        }

        // Add Event to User Wishlist
        const profileWishlist = await prisma.usersWishlist.create({

            data: 
            {
                userId: userId,
                eventId: eventId,
            },
        });

        res.status(200).json({ message: 'Event Added to Wishlist Successfully.', profileWishlist });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Add Event to Wishlist.', details: error.message });
    }
};

// Remove Event from User Wishlist (Respective Authenticated User Only) (Token)
exports.removeFromWishlist = async (req, res) =>
{
    const 
    { 
        eventId,

    } = req.body;

    try 
    {
        // Get User ID from Token
        const userId = req.users.id;
        
        // Check if the Relationship Exists
        const profileWishlist = await prisma.usersWishlist.findFirst({

            where: 
            {
                userId: userId, // Use userId from the Token
                eventId: eventId,
            },
        });

        if (!profileWishlist) 
        {
            return res.status(404).json({ error: 'The Event is not on the Wishlist.', profileWishlist });
        }

        // Delete from Wishlist
        await prisma.usersWishlist.delete({

            where: 
            {
                id: profileWishlist.id, // Use the PK to Delete
            },
        });

        res.status(200).json({ message: 'Event Removed from Wishlist Successfully.', profileWishlist });
    } 

    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Remove Event from Wishlist.', details: error.message });
    }
};