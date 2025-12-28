/**
 * Prediction Model Schema
 * Implements: prediction_id, article_id (ref Article), fake_probability,
 * confidence_score, predicted_at
 */

const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article reference is required'],
    unique: true // One prediction per article
  },
  fake_probability: {
    type: Number,
    required: [true, 'Fake probability is required'],
    min: [0, 'Fake probability must be between 0 and 1'],
    max: [1, 'Fake probability must be between 0 and 1']
  },
  confidence_score: {
    type: Number,
    required: [true, 'Confidence score is required'],
    min: [0, 'Confidence score must be between 0 and 1'],
    max: [1, 'Confidence score must be between 0 and 1']
  },
  predicted_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // Using custom predicted_at field
});

// Index for faster queries
predictionSchema.index({ article_id: 1 });
predictionSchema.index({ predicted_at: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);

