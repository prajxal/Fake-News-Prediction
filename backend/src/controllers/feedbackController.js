/**
 * Feedback Controller
 * Handles user feedback on predictions
 * Protected routes require JWT authentication
 */

const { validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Article = require('../models/Article');
const User = require('../models/User');

/**
 * Submit feedback on article prediction
 * POST /api/feedback
 * Protected route
 */
const submitFeedback = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { article_id, feedback_type } = req.body;
    const userId = req.user.userId;

    // Verify article exists
    const article = await Article.findById(article_id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Create feedback (unique constraint prevents duplicates)
    try {
      const feedback = await Feedback.create({
        article_id,
        user_id: userId,
        feedback_type,
        created_at: new Date()
      });

      // Update user reputation score based on feedback
      // Simple logic: +1 for providing feedback
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation_score: 1 }
      });

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: {
          feedback_id: feedback._id,
          article_id: feedback.article_id,
          feedback_type: feedback.feedback_type,
          created_at: feedback.created_at
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          error: 'You have already submitted this type of feedback for this article'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Server error during feedback submission' });
  }
};

/**
 * Get feedback for an article
 * GET /api/feedback/article/:articleId
 * Protected route
 */
const getFeedbackByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const feedbacks = await Feedback.find({ article_id: articleId })
      .populate('user_id', 'username')
      .sort({ created_at: -1 });

    res.json({
      feedbacks: feedbacks.map(fb => ({
        feedback_id: fb._id,
        article_id: fb.article_id,
        user: {
          user_id: fb.user_id._id,
          username: fb.user_id.username
        },
        feedback_type: fb.feedback_type,
        created_at: fb.created_at
      }))
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Server error fetching feedback' });
  }
};

module.exports = { submitFeedback, getFeedbackByArticle };

