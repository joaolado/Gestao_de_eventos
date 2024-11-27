
const paymentDetailsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_PaymentDetails');

// PaymentDetails CRUD
// Public Routes (No Authentication Required - Token)
paymentDetailsRouter.get('/', authenticateToken, controller.getAll);                                                                            // Get all PaymentDetails
paymentDetailsRouter.get('/:id', authenticateToken, controller.getById);                                                                        // Get a PaymentDetails by ID

// Protected Routes (Authentication Required - Token)
paymentDetailsRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);                     // Create a new PaymentDetails
paymentDetailsRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);                      // Update a PaymentDetails
paymentDetailsRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);         // Delete a PaymentDetails by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
paymentDetailsRouter.patch('/update-status', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateStatus); // Update PaymentDetails Status by ID

module.exports = paymentDetailsRouter;