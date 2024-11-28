
const profileRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');  // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');       // Import authorizeRole
const upload = require('../../middlewares/uploadprofilePicMiddleware'); // Import Multer Upload Middleware
const controller = require('../../controllers/v1/profileController');


// User Profile CRUD (Authentication Required - Respective Token)
profileRouter.put('/', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), upload.single('profilePic'), controller.profile); // Update User Profile

module.exports = profileRouter;