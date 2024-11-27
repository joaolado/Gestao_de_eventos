
const orderDetailsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_OrderDetails');

// OrderDetails CRUD
orderDetailsRouter.get('/', controller.getAll);              // Get all OrderDetails
orderDetailsRouter.get('/:id', controller.getById);          // Get a OrderDetails by ID
orderDetailsRouter.post('/create', authenticateToken, controller.create);       // Create a new OrderDetails
orderDetailsRouter.put('/update', authenticateToken, controller.update);        // Update a OrderDetails
orderDetailsRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a OrderDetails by ID

// PATCH Used for Parcial Update
orderDetailsRouter.patch('/update-cart', authenticateToken, controller.updateCart);     // Update Cart Status by ID
orderDetailsRouter.patch('/update-status', authenticateToken, controller.updateStatus); // Update OrderDetails Status by ID

module.exports = orderDetailsRouter;