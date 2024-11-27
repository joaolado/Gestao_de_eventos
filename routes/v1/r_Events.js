
const eventsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/v1/c_Events');


// Events CRUD
eventsRouter.get('/', controller.getAll);                          // Get all Events
eventsRouter.get('/:id', controller.getById);                      // Get a Events by ID
eventsRouter.post('/create', authenticateToken, controller.create);                   // Create a new Events
eventsRouter.put('/update', authenticateToken, controller.update);                    // Update a Events
eventsRouter.delete('/delete/:id', authenticateToken, controller.delete);             // Delete a Events by ID

// PATCH Used for Parcial Update
eventsRouter.patch('/restore/:id', authenticateToken, controller.restore);            // Restore Events by ID
eventsRouter.patch('/update-status', authenticateToken, controller.updateStatus);     // Update Events Status by ID


// Search with Filters and Order
// GET Single Filter    /events?const=text
// GET Multiple Filters /events?const=text&const=text

// GET Sort By and Sort Order /events?sortBy=text&sortOrder=desc or asc

module.exports = eventsRouter;