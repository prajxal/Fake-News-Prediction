/**
 * Article Model Schema
 * Implements: article_id, title, content, user_id (ref User), published_date
 */

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [500, 'Title cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Article content is required'],
    trim: true,
    minlength: [50, 'Article content must be at least 50 characters']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  published_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // Using custom published_date field
});

// Index for faster queries
articleSchema.index({ user_id: 1 });
articleSchema.index({ published_date: -1 });

module.exports = mongoose.model('Article', articleSchema);

