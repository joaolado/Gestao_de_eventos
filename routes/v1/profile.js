
const profileRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');  // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');       // Import authorizeRole
const upload = require('../../middlewares/uploadprofilePicMiddleware'); // Import Multer Upload Middleware
const controller = require('../../controllers/v1/profileController');


// User Profile CRUD (Authentication Required - Respective Token)
profileRouter.get('/get-profile', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.getProfile);                      // Get User Profile
profileRouter.put('/update', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), upload.single('profilePic'), controller.profile); // Update User Profile

// Wishlist Routes (Authentication Required - Respective Token)
profileRouter.get('/get-wishlist', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.getWishlist);                    // Get User Wishlist
profileRouter.post('/add-to-wishlist', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.addToWishlist);              // Add To User Wishlist
profileRouter.delete('/remove-from-wishlist', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.removeFromWishlist);  // Remove From User Wishlist

// Share an Event
profileRouter.post('/share-event', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.shareEvent);   

// Get Shared Events
profileRouter.get('/get-shared-events', authenticateToken, authorizeRole(['UserClient', 'UserAdmin', 'UserSuperAdmin']), controller.getSharedEvents); 

module.exports = profileRouter;