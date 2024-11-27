
const ticketsInfoRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_TicketsInfo');

// TicketsInfo CRUD
// Public Routes (No Authentication Required - Token)
ticketsInfoRouter.get('/', authenticateToken, controller.getAll);                                                                            // Get all TicketsInfo
ticketsInfoRouter.get('/:id', authenticateToken, controller.getById);                                                                        // Get a TicketsInfo by ID

// Protected Routes (Authentication Required - Token)
ticketsInfoRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);                     // Create a new TicketsInfo
ticketsInfoRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);                      // Update a TicketsInfo
ticketsInfoRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);         // Delete a TicketsInfo by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
ticketsInfoRouter.patch('/restore/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.restore);        // Restore TicketsInfo by ID
ticketsInfoRouter.patch('/update-status', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateStatus); // Update TicketsInfo Status by ID

module.exports = ticketsInfoRouter;