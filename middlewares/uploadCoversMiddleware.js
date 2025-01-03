
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure Multer Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => 
    {
        cb(null, '0website/public/uploads/covers'); // Save Directory
    },

    filename: async (req, file, cb) =>
    {
        try
        {   
            // Get Event ID
            const { id } = req.body;

            if (!id) {
                return cb(new Error('Event ID is missing.'));
            }

            // Get Event Details
            const event = await prisma.events.findUnique({

                where: { id: parseInt(id) }, // Find Category by ID 

                select: 
                {   
                    cover: true,
                },
            });

            if (!event) 
            {
                return cb(new Error('Event Not Found.')); // If Not Found, Use 'default'
            }

            // Generate a Unique File Name With Event ID and Timestamp
            const fileName = `${Date.now()}-${file.originalname}`;

            // Check for Old cover and Delete it
            if (event.cover) 
            {   
                // Construct the Full Path
                const oldCoverPath  = path.join(__dirname, '../0website/public/uploads/covers', event.cover);     

                fs.unlink(oldCoverPath , (err) => 
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

            // Update Event's Profile Picture in the Database (Only the filename)
            await prisma.events.update({

                where: { id: parseInt(id) },
                data: { cover: fileName }, // Save Only the filename

            });

            // Save File With the Generated Name
            cb(null, fileName);
        } 
        
        catch (error) 
        {
            cb(new Error('Failed to Get Event ID.'));
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