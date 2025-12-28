/**
 * Article Routes
 * Handles article submission and retrieval
 * All routes are protected with JWT authentication
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { submitArticle, getArticles, getArticleById } = require('../controllers/articleController');

// Validation rules
const articleValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 500 })
    .withMessage('Title cannot exceed 500 characters'),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
];

// Routes (all protected)
router.post('/', auth, articleValidation, submitArticle);
router.get('/', auth, getArticles);
router.get('/:id', auth, getArticleById);

module.exports = router;

