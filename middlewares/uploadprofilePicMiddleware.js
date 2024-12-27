
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure Multer Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => 
    {
        cb(null, 'uploads/profilePic'); // Save Directory
    },

    filename: async (req, file, cb) =>
    {
        try
        {
            // Get User ID from Token
            const userId = req.users.id;

            // Get User Details
            const user = await prisma.users.findUnique({

                where: 
                { 
                    id: userId // Use userId from the Token
                }, 

                select: 
                { 
                    profilePic: true 
                },
            });

            if (!user) 
            {
                return cb(new Error('User Not Found.')); // If Not Found, Use 'default'
            }

            // Generate a Unique File Name With User ID and Timestamp
            const fileName = `${userId}-${Date.now()}-${file.originalname}`;

            // Check for Old profilePic and Delete it (Windows Remove Read-Only - Folder Properties)
            if (user.profilePic) 
            {   
                // Construct the Full Path
                const oldProfilePicPath  = path.join(__dirname, '..', user.profilePic); 

                // Normalize the Path for Cross-Platform Compatibility
                const normalizedOldProfilePicPath  = path.normalize(oldProfilePicPath);     

                fs.unlink(normalizedOldProfilePicPath , (err) => 
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

            // Save File with the Generated Name
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
            cb(new Error('Only images are Allowed! ( jpeg | jpg | png | gif )')); // Allowed Extensions
        }
    },

    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB Limit
});

module.exports = upload;