/**
 * Article Controller
 * Handles article submission and retrieval
 * Protected routes require JWT authentication
 */

const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Prediction = require('../models/Prediction');
const { detectFakeNews } = require('../utils/mlService');

/**
 * Submit article for fake news detection
 * POST /api/articles
 * Protected route
 */
const submitArticle = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.userId;

    // Create article
    const article = await Article.create({
      title,
      content,
      user_id: userId,
      published_date: new Date()
    });

    // Run ML model for fake news detection
    const mlResult = await detectFakeNews(title, content);

    // Create prediction record
    const prediction = await Prediction.create({
      article_id: article._id,
      fake_probability: mlResult.fake_probability,
      confidence_score: mlResult.confidence_score,
      predicted_at: new Date()
    });

    res.status(201).json({
      message: 'Article submitted and analyzed',
      article: {
        article_id: article._id,
        title: article.title,
        content: article.content,
        published_date: article.published_date
      },
      prediction: {
        prediction_id: prediction._id,
        fake_probability: prediction.fake_probability,
        confidence_score: prediction.confidence_score,
        predicted_at: prediction.predicted_at
      }
    });
  } catch (error) {
    console.error('Article submission error:', error);
    res.status(500).json({ error: 'Server error during article submission' });
  }
};

/**
 * Get all articles with predictions
 * GET /api/articles
 * Protected route
 */
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('user_id', 'username email')
      .sort({ published_date: -1 })
      .limit(50);

    const articlesWithPredictions = await Promise.all(
      articles.map(async (article) => {
        const prediction = await Prediction.findOne({ article_id: article._id });
        return {
          article_id: article._id,
          title: article.title,
          content: article.content,
          user: {
            user_id: article.user_id._id,
            username: article.user_id.username
          },
          published_date: article.published_date,
          prediction: prediction ? {
            prediction_id: prediction._id,
            fake_probability: prediction.fake_probability,
            confidence_score: prediction.confidence_score,
            predicted_at: prediction.predicted_at
          } : null
        };
      })
    );

    res.json({ articles: articlesWithPredictions });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Server error fetching articles' });
  }
};

/**
 * Get single article with prediction
 * GET /api/articles/:id
 * Protected route
 */
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('user_id', 'username email');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const prediction = await Prediction.findOne({ article_id: article._id });

    res.json({
      article: {
        article_id: article._id,
        title: article.title,
        content: article.content,
        user: {
          user_id: article.user_id._id,
          username: article.user_id.username
        },
        published_date: article.published_date
      },
      prediction: prediction ? {
        prediction_id: prediction._id,
        fake_probability: prediction.fake_probability,
        confidence_score: prediction.confidence_score,
        predicted_at: prediction.predicted_at
      } : null
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Server error fetching article' });
  }
};

module.exports = { submitArticle, getArticles, getArticleById };

