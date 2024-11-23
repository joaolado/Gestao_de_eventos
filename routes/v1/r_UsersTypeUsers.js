
const usersTypeUsersRouter = require('express').Router();
const controller = require('../../controllers/v1/c_UsersTypeUsers');

// UsersTypeUsers CRUD
usersTypeUsersRouter.get('/', controller.getAll);                            // Get all UsersTypeUsers
usersTypeUsersRouter.get('/user/:usersId', controller.getByUserId);          // Get by Users by ID
usersTypeUsersRouter.get('/type/:usersTypeId', controller.getByUsersTypeId); // Get by UsersType ID
usersTypeUsersRouter.post('/create', controller.create);                     // Create a new UsersTypeUsers
usersTypeUsersRouter.delete('/delete/:id', controller.delete);               // Delete a UsersTypeUsers by ID

module.exports = usersTypeUsersRouter;