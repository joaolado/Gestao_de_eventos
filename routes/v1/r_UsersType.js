
const usersTypeRouter = require('express').Router();
const controller = require('../../controllers/v1/c_UsersType');

// UsersType CRUD
usersTypeRouter.get('/', controller.getAll);              // Get all UsersType
usersTypeRouter.get('/:id', controller.getById);          // Get a UsersType by ID
usersTypeRouter.post('/create', controller.create);       // Create a new UsersType
usersTypeRouter.put('/update', controller.update);        // Update a UsersType
usersTypeRouter.delete('/delete/:id', controller.delete); // Delete a UsersType by ID

module.exports = usersTypeRouter;