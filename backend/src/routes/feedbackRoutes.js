/**
 * Feedback Routes
 * Handles user feedback on predictions
 * All routes are protected with JWT authentication
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { submitFeedback, getFeedbackByArticle } = require('../controllers/feedbackController');

// Validation rules
const feedbackValidation = [
  body('article_id')
    .notEmpty()
    .withMessage('Article ID is required')
    .isMongoId()
    .withMessage('Invalid article ID'),
  body('feedback_type')
    .isIn(['accurate', 'inaccurate', 'helpful', 'not_helpful'])
    .withMessage('Invalid feedback type')
];

// Routes (all protected)
router.post('/', auth, feedbackValidation, submitFeedback);
router.get('/article/:articleId', auth, getFeedbackByArticle);

module.exports = router;

