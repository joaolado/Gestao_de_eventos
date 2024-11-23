
const orderDetailsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_OrderDetails');

// OrderDetails CRUD
orderDetailsRouter.get('/', controller.getAll);              // Get all OrderDetails
orderDetailsRouter.get('/:id', controller.getById);          // Get a OrderDetails by ID
orderDetailsRouter.post('/create', controller.create);       // Create a new OrderDetails
orderDetailsRouter.put('/update', controller.update);        // Update a OrderDetails
orderDetailsRouter.delete('/delete/:id', controller.delete); // Delete a OrderDetails by ID

// PATCH Used for Parcial Update
orderDetailsRouter.patch('/update-cart', controller.updateCart);     // Update Cart Status by ID
orderDetailsRouter.patch('/update-status', controller.updateStatus); // Update OrderDetails Status by ID

module.exports = orderDetailsRouter;