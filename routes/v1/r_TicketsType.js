
const ticketsTypeRouter = require('express').Router();
const controller = require('../../controllers/v1/c_TicketsType');

// TicketsType CRUD
ticketsTypeRouter.get('/', controller.getAll);              // Get all TicketsType
ticketsTypeRouter.get('/:id', controller.getById);          // Get a TicketsType by ID
ticketsTypeRouter.post('/create', controller.create);       // Create a new TicketsType
ticketsTypeRouter.put('/update', controller.update);        // Update a TicketsType
ticketsTypeRouter.delete('/delete/:id', controller.delete); // Delete a TicketsType by ID

// PATCH Used for Parcial Update
ticketsTypeRouter.patch('/update-status', controller.updateStatus);     // Update TicketsType Status by ID

module.exports = ticketsTypeRouter;