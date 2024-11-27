
const ticketsInfoRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const controller = require('../../controllers/v1/c_TicketsInfo');

// TicketsInfo CRUD
// Public Routes (No Authentication Required - Token)
ticketsInfoRouter.get('/', controller.getAll);                                         // Get all TicketsInfo
ticketsInfoRouter.get('/:id', controller.getById);                                     // Get a TicketsInfo by ID

// Protected Routes (Authentication Required - Token)
ticketsInfoRouter.post('/create', authenticateToken, controller.create);               // Create a new TicketsInfo
ticketsInfoRouter.put('/update', authenticateToken, controller.update);                // Update a TicketsInfo
ticketsInfoRouter.delete('/delete/:id', authenticateToken, controller.delete);         // Delete a TicketsInfo by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
ticketsInfoRouter.patch('/restore/:id', authenticateToken, controller.restore);        // Restore TicketsInfo by ID
ticketsInfoRouter.patch('/update-status', authenticateToken, controller.updateStatus); // Update TicketsInfo Status by ID

module.exports = ticketsInfoRouter;