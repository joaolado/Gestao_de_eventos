
const usersRouter = require('express').Router();
const controller = require('../../controllers/v1/c_Users');

// Users CRUD
usersRouter.get('/', controller.getAll);               // Get all Users
usersRouter.get('/:id', controller.getById);           // Get a Users by ID
usersRouter.post('/create', controller.create);        // Create a new Users
usersRouter.put('/update', controller.update);         // Update a Users
usersRouter.delete('/delete/:id', controller.delete);  // Delete a Users by ID

// PATCH Used for Parcial Update
usersRouter.patch('/restore/:id', controller.restore); // Restore Users by ID

module.exports = usersRouter;