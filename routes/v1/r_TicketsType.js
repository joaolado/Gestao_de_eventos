
const ticketsTypeRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const controller = require('../../controllers/v1/c_TicketsType');

// TicketsType CRUD
// Public Routes (No Authentication Required - Token)
ticketsTypeRouter.get('/', controller.getAll);                                         // Get all TicketsType
ticketsTypeRouter.get('/:id', controller.getById);                                     // Get a TicketsType by ID

// Protected Routes (Authentication Required - Token)
ticketsTypeRouter.post('/create', authenticateToken, controller.create);               // Create a new TicketsType
ticketsTypeRouter.put('/update', authenticateToken, controller.update);                // Update a TicketsType
ticketsTypeRouter.delete('/delete/:id', authenticateToken, controller.delete);         // Delete a TicketsType by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
ticketsTypeRouter.patch('/update-status', authenticateToken, controller.updateStatus); // Update TicketsType Status by ID

module.exports = ticketsTypeRouter;