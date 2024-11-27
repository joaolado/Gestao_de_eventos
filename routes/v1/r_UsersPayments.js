
const usersPaymentsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_UsersPayments');

// UsersPayments CRUD
usersPaymentsRouter.get('/', controller.getAll);              // Get all UsersPayments
usersPaymentsRouter.get('/:id', controller.getById);          // Get a UsersPayments by ID
usersPaymentsRouter.post('/create', controller.create);       // Create a new UsersPayments
usersPaymentsRouter.put('/update', controller.update);        // Update a UsersPayments
usersPaymentsRouter.delete('/delete/:id', controller.delete); // Delete a UsersPayments by ID

module.exports = usersPaymentsRouter;