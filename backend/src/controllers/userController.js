/**
 * User Controller
 * Handles user profile management
 */

const User = require('../models/User');

/**
 * Update user profile (username only)
 * PUT /api/users/me
 * Protected route
 * Demonstrates: User.findByIdAndUpdate
 */
const updateUserProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.userId; // From auth middleware

        // Validate input
        if (!username || typeof username !== 'string' || username.trim().length === 0) {
            return res.status(400).json({ error: 'Username is required and must be a non-empty string' });
        }

        // UPDATE operation: findByIdAndUpdate
        // Using { new: true } to return updated doc
        // Using { runValidators: true } to enforce schema rules (unique, minlength, etc)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username: username.trim() },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with updated user data (password_hash excluded by toJSON in model)
        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
};

module.exports = { updateUserProfile };
