const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateOfficer } = require('../middleware/auth');

/**
 * Auth Routes
 */
router.post('/login', AuthController.login);
router.get('/me', authenticateOfficer, AuthController.getMe);

module.exports = router;
