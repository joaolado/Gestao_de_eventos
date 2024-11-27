
const eventsCategoryRouter = require('express').Router();
const controller = require('../../controllers/v1/c_EventsCategory');

// EventsCategory CRUD
eventsCategoryRouter.get('/', controller.getAll);              // Get all EventsCategory
eventsCategoryRouter.get('/:id', controller.getById);          // Get a EventsCategory by ID
eventsCategoryRouter.post('/create', controller.create);       // Create a new EventsCategory
eventsCategoryRouter.put('/update', controller.update);        // Update a EventsCategory
eventsCategoryRouter.delete('/delete/:id', controller.delete); // Delete a EventsCategory by ID

module.exports = eventsCategoryRouter;