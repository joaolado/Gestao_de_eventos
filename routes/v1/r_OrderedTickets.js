
const orderedTicketsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole

const controller = require('../../controllers/v1/c_OrderedTickets');

// OrderedTickets CRUD
// Public Routes (No Authentication Required - Token)
orderedTicketsRouter.get('/', authenticateToken, controller.getAll);                                                                    // Get all OrderedTickets
orderedTicketsRouter.get('/:id', authenticateToken, controller.getById);                                                                // Get a OrderedTickets by ID

// Protected Routes (Authentication Required - Token)
orderedTicketsRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);             // Create a new OrderedTickets
orderedTicketsRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);              // Update a OrderedTickets
orderedTicketsRouter.delete('/delete/:id', authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);                    // Delete a OrderedTickets by ID

module.exports = orderedTicketsRouter;