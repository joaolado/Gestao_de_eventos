
const orderDetailsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_OrderDetails');

// OrderDetails CRUD
// Public Routes (No Authentication Required - Token)
orderDetailsRouter.get('/', authenticateToken, controller.getAll);                                                                            // Get all OrderDetails
orderDetailsRouter.get('/:id', authenticateToken, controller.getById);                                                                        // Get a OrderDetails by ID

// Protected Routes (Authentication Required - Token)
orderDetailsRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);                     // Create a new OrderDetails
orderDetailsRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);                      // Update a OrderDetails
orderDetailsRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);         // Delete a OrderDetails by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
orderDetailsRouter.patch('/update-cart', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateCart);     // Update Cart Status by ID
orderDetailsRouter.patch('/update-status', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateStatus); // Update OrderDetails Status by ID

module.exports = orderDetailsRouter;