/**
 * User Routes
 * Handles user profile operations
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateUserProfile } = require('../controllers/userController');

// PUT /api/users/me - Update user profile (username)
router.put('/me', auth, updateUserProfile);

/** 
 * Test via Postman:
 * PUT /api/users/me
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { "username": "new_username" }
 */

module.exports = router;
