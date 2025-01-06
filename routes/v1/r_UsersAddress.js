
const usersAddressRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole

const controller = require('../../controllers/v1/c_UsersAddress');

// UsersAddress CRUD
// Public Routes (No Authentication Required - Token)
usersAddressRouter.get('/', authenticateToken, controller.getAll);                                                                    // Get all UsersAddress
usersAddressRouter.get('/:id', authenticateToken, controller.getById);                                                                // Get a UsersAddress by ID

// Protected Routes (Authentication Required - Token)
usersAddressRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);             // Create a new UsersAddress
usersAddressRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);              // Update a UsersAddress
usersAddressRouter.delete('/delete/:id', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.delete);       // Delete a UsersAddress by ID

module.exports = usersAddressRouter;