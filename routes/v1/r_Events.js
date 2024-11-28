
const eventsRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const upload = require('../../middlewares/uploadCoversMiddleware');    // Import Multer Upload Middleware
const controller = require('../../controllers/v1/c_Events');

// Events CRUD
// Public Routes (No Authentication Required - Token)
eventsRouter.get('/', authenticateToken, controller.getAll);                                                                                // Get all Events
eventsRouter.get('/:id', authenticateToken, controller.getById);                                                                            // Get a Events by ID

// Protected Routes (Authentication Required - Token)
eventsRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), upload.single('cover'), controller.create); // Create a new Events
eventsRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), upload.single('cover'), controller.update);  // Update a Events
eventsRouter.delete('/delete/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);             // Delete a Events by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
eventsRouter.patch('/restore/:id', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.restore);            // Restore Events by ID
eventsRouter.patch('/update-status', authenticateToken, authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateStatus);     // Update Events Status by ID


// Search with Filters and Order
// GET Single Filter    /events?const=text
// GET Multiple Filters /events?const=text&const=text

// GET Sort By and Sort Order /events?sortBy=text&sortOrder=desc or asc

module.exports = eventsRouter;