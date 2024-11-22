
const eventsRouter = require('express').Router();
const controller = require('../../controllers/v1/c_Events');

// Events CRUD
eventsRouter.get('/', controller.getAll);              // Get all Events
eventsRouter.get('/:id', controller.getById);          // Get a Events by ID
eventsRouter.post('/create', controller.create);       // Create a new Events
eventsRouter.put('/update', controller.update);        // Update a Events
eventsRouter.delete('/delete/:id', controller.delete); // Delete a Events by ID

module.exports = eventsRouter;