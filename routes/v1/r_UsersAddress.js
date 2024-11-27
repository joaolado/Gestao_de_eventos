
const usersAddressRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const controller = require('../../controllers/v1/c_UsersAddress');

// UsersAddress CRUD
// Public Routes (No Authentication Required - Token)
usersAddressRouter.get('/', controller.getAll);                                 // Get all UsersAddress
usersAddressRouter.get('/:id', controller.getById);                             // Get a UsersAddress by ID

// Protected Routes (Authentication Required - Token)
usersAddressRouter.post('/create', authenticateToken, controller.create);       // Create a new UsersAddress
usersAddressRouter.put('/update', authenticateToken, controller.update);        // Update a UsersAddress
usersAddressRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a UsersAddress by ID

module.exports = usersAddressRouter;