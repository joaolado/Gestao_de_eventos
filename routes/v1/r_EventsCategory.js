
const eventsCategoryRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const controller = require('../../controllers/v1/c_EventsCategory');

// EventsCategory CRUD
// Public Routes (No Authentication Required - Token)
eventsCategoryRouter.get('/', controller.getAll);                                 // Get all EventsCategory
eventsCategoryRouter.get('/:id', controller.getById);                             // Get a EventsCategory by ID

// Protected Routes (Authentication Required - Token)
eventsCategoryRouter.post('/create', authenticateToken, controller.create);       // Create a new EventsCategory
eventsCategoryRouter.put('/update', authenticateToken, controller.update);        // Update a EventsCategory
eventsCategoryRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a EventsCategory by ID

module.exports = eventsCategoryRouter;