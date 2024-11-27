
const orderedTicketsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_OrderedTickets');

// OrderedTickets CRUD
orderedTicketsRouter.get('/', controller.getAll);              // Get all OrderedTickets
orderedTicketsRouter.get('/:id', controller.getById);          // Get a OrderedTickets by ID
orderedTicketsRouter.post('/create', authenticateToken, controller.create);       // Create a new OrderedTickets
orderedTicketsRouter.put('/update', authenticateToken, controller.update);        // Update a OrderedTickets
orderedTicketsRouter.delete('/delete/:id', authenticateToken, controller.delete); // Delete a OrderedTickets by ID

module.exports = orderedTicketsRouter;