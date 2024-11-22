
const usersAddressRouter = require('express').Router();
const controller = require('../../controllers/v1/c_UsersAddress');

// UsersAddress CRUD
usersAddressRouter.get('/', controller.getAll);              // Get all UsersAddress
usersAddressRouter.get('/:id', controller.getById);          // Get a UsersAddress by ID
usersAddressRouter.post('/create', controller.create);       // Create a new UsersAddress
usersAddressRouter.put('/update', controller.update);        // Update a UsersAddress
usersAddressRouter.delete('/delete/:id', controller.delete); // Delete a UsersAddress by ID

module.exports = usersAddressRouter;