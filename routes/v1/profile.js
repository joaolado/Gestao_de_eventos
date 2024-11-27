const profileRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const controller = require('../../controllers/v1/profileController');


// User Profile CRUD (Authentication Required - Respective Token)
profileRouter.put('/', authenticateToken, controller.profile); // Update User Profile

module.exports = profileRouter;