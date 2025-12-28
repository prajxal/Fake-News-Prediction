/**
 * ML Model Service for Fake News Detection
 * Integrates with pre-trained model (HuggingFace or sklearn pickle)
 * Returns fake_probability and confidence_score
 * 
 * Note: For demo purposes, using a simple heuristic-based approach
 * In production, replace with actual ML model inference
 */

const fs = require('fs');
const path = require('path');

/**
 * Simple heuristic-based fake news detector (for demo)
 * Replace this with actual ML model inference
 * 
 * @param {string} title - Article title
 * @param {string} content - Article content
 * @returns {Object} { fake_probability, confidence_score }
 */
const detectFakeNews = async (title, content) => {
  try {
    // Check if ML model file exists
    const modelPath = process.env.ML_MODEL_PATH || './ml-model/fake_news_model.pkl';
    
    // For demo: Simple heuristic-based detection
    // In production, load and use actual ML model here
    // Example: const model = await loadModel(modelPath);
    // const prediction = await model.predict(features);
    
    // Heuristic: Check for suspicious patterns
    const suspiciousKeywords = [
      'breaking', 'shocking', 'you won\'t believe', 'doctors hate',
      'secret', 'miracle', 'guaranteed', 'click here', 'limited time'
    ];
    
    const text = (title + ' ' + content).toLowerCase();
    let suspiciousCount = 0;
    
    suspiciousKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        suspiciousCount++;
      }
    });
    
    // Calculate fake probability (0-1 scale)
    const fake_probability = Math.min(0.3 + (suspiciousCount * 0.15), 0.95);
    
    // Calculate confidence based on content length and keyword matches
    const contentLength = content.length;
    const confidence_score = Math.min(
      0.5 + (contentLength / 1000) * 0.3 + (suspiciousCount > 0 ? 0.2 : 0),
      0.95
    );
    
    return {
      fake_probability: parseFloat(fake_probability.toFixed(4)),
      confidence_score: parseFloat(confidence_score.toFixed(4))
    };
  } catch (error) {
    console.error('ML Model Error:', error);
    // Fallback: Return neutral prediction
    return {
      fake_probability: 0.5,
      confidence_score: 0.3
    };
  }
};

module.exports = { detectFakeNews };

