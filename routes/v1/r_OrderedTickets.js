
const orderedTicketsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_OrderedTickets');

// OrderedTickets CRUD
orderedTicketsRouter.get('/', controller.getAll);              // Get all OrderedTickets
orderedTicketsRouter.get('/:id', controller.getById);          // Get a OrderedTickets by ID
orderedTicketsRouter.post('/create', controller.create);       // Create a new OrderedTickets
orderedTicketsRouter.put('/update', controller.update);        // Update a OrderedTickets
orderedTicketsRouter.delete('/delete/:id', controller.delete); // Delete a OrderedTickets by ID

module.exports = orderedTicketsRouter;