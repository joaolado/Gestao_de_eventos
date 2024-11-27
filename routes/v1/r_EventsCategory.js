
const eventsCategoryRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_EventsCategory');

// EventsCategory CRUD
// Public Routes (No Authentication Required - Token)
eventsCategoryRouter.get('/', authenticateToken, controller.getAll);                                                                    // Get all EventsCategory
eventsCategoryRouter.get('/:id', authenticateToken, controller.getById);                                                                // Get a EventsCategory by ID

// Protected Routes (Authentication Required - Token)
eventsCategoryRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);             // Create a new EventsCategory
eventsCategoryRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);              // Update a EventsCategory
eventsCategoryRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete); // Delete a EventsCategory by ID

module.exports = eventsCategoryRouter;