
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure Multer Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => 
    {
        cb(null, '0website/public/uploads/profilePic'); // Save Directory
    },

    filename: async (req, file, cb) =>
    {
        try
        {
            // Get User ID from Token
            const userId = req.users.id;

            // Generate a Unique File Name With User ID and Timestamp
            const fileName = `${userId}-${Date.now()}-${file.originalname}`;

            // Get User Details
            const user = await prisma.users.findUnique({

                where: 
                { 
                    id: userId
                }, 

                select: 
                { 
                    profilePic: true 
                },
            });

            if (!user) 
            {
                return cb(new Error('User Not Found.'));
            }

            // Check for Old profilePic and Delete it
            if (user.profilePic) 
            {   
                // Construct the Full Path
                const oldProfilePicPath  = path.join(__dirname, '../0website/public/uploads/profilePic', user.profilePic);     

                fs.unlink(oldProfilePicPath , (err) => 
                {
                    if (err) 
                    {
                        console.error('Error Deleting Old Profile Pic.', err);
                    } 
                    
                    else 
                    {
                        console.log('Old Profile Pic Deleted Successfully.');
                    }
                });
            }

            // Update User's Profile Picture in the Database (Only the filename)
            await prisma.users.update({

                where: { id: userId },
                data: { profilePic: fileName },

            });

            // Save File With the Generated Name
            cb(null, fileName);
        } 
        
        catch (error) 
        {
            cb(new Error('Failed to Get User ID.'));
        }
    },
});

const upload = multer({
    storage,
    
    fileFilter: (req, file, cb) => 
    {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed Extensions
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) 
        {
            cb(null, true);
        } 

        else 
        {
            cb(new Error('Only images are Allowed! ( jpeg | jpg | png | gif )'));
        }
    },

    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB Limit
});

module.exports = upload;