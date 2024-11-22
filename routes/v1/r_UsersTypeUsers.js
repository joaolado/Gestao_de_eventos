
const usersTypeUsersRouter = require('express').Router();
const controller = require('../../controllers/v1/c_UsersTypeUsers');

// UsersTypeUsers CRUD
usersTypeUsersRouter.get('/', controller.getAll);              // Get all UsersTypeUsers
usersTypeUsersRouter.get('/:id', controller.getById);          // Get a UsersTypeUsers by ID
usersTypeUsersRouter.post('/create', controller.create);       // Create a new UsersTypeUsers
usersTypeUsersRouter.put('/update', controller.update);        // Update a UsersTypeUsers
usersTypeUsersRouter.delete('/delete/:id', controller.delete); // Delete a UsersTypeUsers by ID

module.exports = usersTypeUsersRouter;