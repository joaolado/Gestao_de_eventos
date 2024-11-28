
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => 
    {
        cb(null, 'uploads/covers'); // Saves in 'uploads/covers' Directory
    },

    filename: (req, file, cb) =>
    {
        cb(null, `${Date.now()}-${file.originalname}`); // Ensure Unique File Names
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