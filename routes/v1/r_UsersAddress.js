
const usersAddressRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_UsersAddress');

// UsersAddress CRUD
usersAddressRouter.get('/', controller.getAll);              // Get all UsersAddress
usersAddressRouter.get('/:id', controller.getById);          // Get a UsersAddress by ID
usersAddressRouter.post('/create', authenticateToken, controller.create);       // Create a new UsersAddress
usersAddressRouter.put('/update', authenticateToken, controller.update);        // Update a UsersAddress
usersAddressRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a UsersAddress by ID

module.exports = usersAddressRouter;