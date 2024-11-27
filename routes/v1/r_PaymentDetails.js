
const paymentDetailsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_PaymentDetails');

// PaymentDetails CRUD
paymentDetailsRouter.get('/', controller.getAll);                      // Get all PaymentDetails
paymentDetailsRouter.get('/:id', controller.getById);                  // Get a PaymentDetails by ID
paymentDetailsRouter.post('/create', authenticateToken, controller.create);               // Create a new PaymentDetails
paymentDetailsRouter.put('/update', authenticateToken, controller.update);                // Update a PaymentDetails
paymentDetailsRouter.delete('/delete/:id', authenticateToken, controller.delete);         // Delete a PaymentDetails by ID

// PATCH Used for Parcial Update
paymentDetailsRouter.patch('/update-status', authenticateToken, controller.updateStatus); // Update PaymentDetails Status by ID

module.exports = paymentDetailsRouter;