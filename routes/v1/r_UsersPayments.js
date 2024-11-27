
const usersPaymentsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_UsersPayments');

// UsersPayments CRUD
// Public Routes (No Authentication Required - Token)
usersPaymentsRouter.get('/', authenticateToken, controller.getAll);                                                                    // Get all UsersPayments
usersPaymentsRouter.get('/:id', authenticateToken, controller.getById);                                                                // Get a UsersPayments by ID

// Protected Routes (Authentication Required - Token)
usersPaymentsRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);             // Create a new UsersPayments
usersPaymentsRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);              // Update a UsersPayments
usersPaymentsRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete); // Delete a UsersPayments by ID

module.exports = usersPaymentsRouter;