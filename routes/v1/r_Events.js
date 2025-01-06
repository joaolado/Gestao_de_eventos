
const eventsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const upload = require('../../middlewares/uploadCoversMiddleware');    // Import Multer Upload Middleware

const controller = require('../../controllers/v1/c_Events');

// Events CRUD
// Public Routes (No Authentication Required - Token)
eventsRouter.get('/', controller.getAll);                                                                                                     // Get all Events
eventsRouter.get('/:id', controller.getById);                                                                                                 // Get a Events by ID

// Protected Routes (Authentication Required - Token)
eventsRouter.put('/edit', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), upload.single('cover'), controller.editEvent);   // Create/Edit Events
eventsRouter.delete('/delete/:id', authenticateToken, authorizeRole(['UserAdmin','UserSuperAdmin']), controller.delete);                      // Delete a Events by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
eventsRouter.patch('/restore/:id', authenticateToken, authorizeRole(['UserAdmin','UserSuperAdmin']), controller.restore);                     // Restore Events by ID
eventsRouter.patch('/update-status', authenticateToken, authorizeRole(['UserAdmin','UserSuperAdmin']), controller.updateStatus);              // Update Events Status by ID


// Search with Filters and Order
// GET Single Filter    /events?const=text
// GET Multiple Filters /events?const=text&const=text

// GET Sort By and Sort Order /events?sortBy=text&sortOrder=desc or asc

module.exports = eventsRouter;