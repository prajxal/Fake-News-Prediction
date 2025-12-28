/**
 * Feedback Model Schema
 * Implements: feedback_id, article_id (ref Article), user_id (ref User),
 * feedback_type, created_at
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article reference is required']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  feedback_type: {
    type: String,
    required: [true, 'Feedback type is required'],
    enum: ['accurate', 'inaccurate', 'helpful', 'not_helpful'],
    // accurate/inaccurate: User's assessment of prediction correctness
    // helpful/not_helpful: User's assessment of prediction usefulness
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: false // Using custom created_at field
});

// Index to prevent duplicate feedback from same user on same article
feedbackSchema.index({ article_id: 1, user_id: 1, feedback_type: 1 }, { unique: true });

// Index for faster queries
feedbackSchema.index({ article_id: 1 });
feedbackSchema.index({ user_id: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);

