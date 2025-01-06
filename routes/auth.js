
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');  // Import the JWT auth Middleware
const refreshToken = require('../middlewares/authRefreshToken');     // Import the Refresh Token Middleware
const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Refresh Token Route
router.post('/refresh-token', authenticateToken, refreshToken);

module.exports = router;