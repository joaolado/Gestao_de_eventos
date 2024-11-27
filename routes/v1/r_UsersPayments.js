
const usersPaymentsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_UsersPayments');

// UsersPayments CRUD
usersPaymentsRouter.get('/', controller.getAll);              // Get all UsersPayments
usersPaymentsRouter.get('/:id', controller.getById);          // Get a UsersPayments by ID
usersPaymentsRouter.post('/create', authenticateToken, controller.create);       // Create a new UsersPayments
usersPaymentsRouter.put('/update', authenticateToken, controller.update);        // Update a UsersPayments
usersPaymentsRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a UsersPayments by ID

module.exports = usersPaymentsRouter;