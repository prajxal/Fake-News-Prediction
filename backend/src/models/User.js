/**
 * User Model Schema
 * Implements: user_id (ObjectId), username (unique), email (unique),
 * password_hash (bcrypt), reputation_score, created_at
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password_hash: {
    type: String,
    required: [true, 'Password hash is required'],
    // Never expose password_hash in JSON responses (handled in toJSON)
  },
  reputation_score: {
    type: Number,
    default: 0,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: false, // Using custom created_at field
  toJSON: {
    transform: function(doc, ret) {
      // Security: Remove password_hash from JSON output
      delete ret.password_hash;
      return ret;
    }
  }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);

