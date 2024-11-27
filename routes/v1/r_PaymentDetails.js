
const paymentDetailsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_PaymentDetails');

// PaymentDetails CRUD
paymentDetailsRouter.get('/', controller.getAll);                      // Get all PaymentDetails
paymentDetailsRouter.get('/:id', controller.getById);                  // Get a PaymentDetails by ID
paymentDetailsRouter.post('/create', controller.create);               // Create a new PaymentDetails
paymentDetailsRouter.put('/update', controller.update);                // Update a PaymentDetails
paymentDetailsRouter.delete('/delete/:id', controller.delete);         // Delete a PaymentDetails by ID

// PATCH Used for Parcial Update
paymentDetailsRouter.patch('/update-status', controller.updateStatus); // Update PaymentDetails Status by ID

module.exports = paymentDetailsRouter;