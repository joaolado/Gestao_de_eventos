
const usersRouter = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware'); // Import the JWT auth Middleware
const authorizeRole = require('../../middlewares/authorizeRole');      // Import authorizeRole
const controller = require('../../controllers/v1/c_Users');

// Users CRUD
// Public Routes (No Authentication Required - Token)
usersRouter.get('/', authenticateToken, controller.getAll);                                                         // Get all Users
usersRouter.get('/:id', authenticateToken, controller.getById);                                                     // Get a Users by ID

// Protected Routes (Authentication Required - Token)
usersRouter.post('/create', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.create);  // Create a new Users
usersRouter.put('/update', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.update);   // Update a Users
usersRouter.delete('/delete/:id', authenticateToken, authorizeRole(['UserSuperAdmin']), controller.delete);         // Delete a Users by ID

// PATCH Used for Parcial Update (Authentication Required - Token)
usersRouter.patch('/restore/:id', authenticateToken, authorizeRole(['UserSuperAdmin']), controller.restore);        // Restore Users by ID
usersRouter.patch('/update-type', authenticateToken, authorizeRole(['UserSuperAdmin']), controller.updateType);     // Update User Type by ID

// Add Event to User
usersRouter.post('/add-event', authenticateToken, controller.addEventToUser);

// Remove Event from User
usersRouter.delete('/remove-event', authenticateToken, authorizeRole(['UserAdmin', 'UserSuperAdmin']), controller.removeEventFromUser);



module.exports = usersRouter;