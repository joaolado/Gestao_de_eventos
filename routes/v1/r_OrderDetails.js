
const orderDetailsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_OrderDetails');

// OrderDetails CRUD
orderDetailsRouter.get('/', controller.getAll);              // Get all OrderDetails
orderDetailsRouter.get('/:id', controller.getById);          // Get a OrderDetails by ID
orderDetailsRouter.post('/create', controller.create);       // Create a new OrderDetails
orderDetailsRouter.put('/update', controller.update);        // Update a OrderDetails
orderDetailsRouter.delete('/delete/:id', controller.delete); // Delete a OrderDetails by ID

module.exports = orderDetailsRouter;