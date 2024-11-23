
const ticketsInfoRouter = require('express').Router();
const controller = require('../../controllers/v1/c_TicketsInfo');

// TicketsInfo CRUD
ticketsInfoRouter.get('/', controller.getAll);               // Get all TicketsInfo
ticketsInfoRouter.get('/:id', controller.getById);           // Get a TicketsInfo by ID
ticketsInfoRouter.post('/create', controller.create);        // Create a new TicketsInfo
ticketsInfoRouter.put('/update', controller.update);         // Update a TicketsInfo
ticketsInfoRouter.delete('/delete/:id', controller.delete);  // Delete a TicketsInfo by ID

// PATCH Used for Parcial Update
ticketsInfoRouter.patch('/restore/:id', controller.restore); // Restore TicketsInfo by ID

module.exports = ticketsInfoRouter;