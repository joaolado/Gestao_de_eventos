
const usersRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_Users');

// Users CRUD
usersRouter.get('/', controller.getAll);                  // Get all Users
usersRouter.get('/:id', controller.getById);              // Get a Users by ID
usersRouter.post('/create', authenticateToken, controller.create);           // Create a new Users
usersRouter.put('/update', authenticateToken, controller.update);            // Update a Users
usersRouter.delete('/delete/:id', authenticateToken, controller.delete);     // Delete a Users by ID

// PATCH Used for Parcial Update
usersRouter.patch('/restore/:id', authenticateToken, controller.restore);    // Restore Users by ID
usersRouter.patch('/update-type', authenticateToken, controller.updateType); // Update User Type by ID

module.exports = usersRouter;