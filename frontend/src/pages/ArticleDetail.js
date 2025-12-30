import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleAPI, feedbackAPI } from '../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await articleAPI.getArticleById(id);
      setArticle(response.data);
    } catch (err) {
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackType) => {
    try {
      await feedbackAPI.submitFeedback(article.article.article_id, feedbackType);
      setFeedbackSubmitted(true);
      alert('Thank you for your feedback!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit feedback');
    }
  };

  const startEditing = () => {
    setEditTitle(article.article.title);
    setEditContent(article.article.content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await articleAPI.updateArticle(article.article.article_id, editTitle, editContent);
      alert('Article updated successfully!');
      setIsEditing(false);
      loadArticle(); // Reload to show new data
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update article');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await articleAPI.deleteArticle(article.article.article_id);
        alert('Article deleted successfully!');
        navigate('/dashboard');
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete article');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!article) return <div className="container"><p>Article not found</p></div>;

  return (
    <div>
      <div className="navbar">
        <div className="navbar-content">
          <h1>Fake News Detection Platform</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>{article.article.title}</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            By {article.article.user?.username} • {new Date(article.article.published_date).toLocaleDateString()}
          </p>

          {!isEditing && (
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={startEditing}
              >
                Edit Article
              </button>
              <button
                className="btn"
                onClick={handleDelete}
                style={{ backgroundColor: '#dc3545', color: 'white' }}
              >
                Delete Article
              </button>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Content:</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', minHeight: '200px', padding: '8px', fontSize: '16px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {article.article.content}
            </div>
          )}

          {article.prediction && (
            <div className={`prediction-result ${article.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`} style={{ marginTop: '30px' }}>
              <h3>
                {article.prediction.fake_probability > 0.5 ? '⚠️ Likely Fake News' : '✓ Likely Real News'}
              </h3>
              <div className="probability-bar">
                <div
                  className={`probability-fill ${article.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`}
                  style={{ width: `${article.prediction.fake_probability * 100}%` }}
                >
                  {Math.round(article.prediction.fake_probability * 100)}% Fake Probability
                </div>
              </div>
              <p><strong>Confidence Score:</strong> {Math.round(article.prediction.confidence_score * 100)}%</p>
              <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                Predicted at: {new Date(article.prediction.predicted_at).toLocaleString()}
              </p>
            </div>
          )}

          {article.prediction && !feedbackSubmitted && (
            <div style={{ marginTop: '20px' }}>
              <h4>Was this prediction helpful?</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleFeedback('helpful')}
                >
                  Helpful
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleFeedback('not_helpful')}
                >
                  Not Helpful
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleFeedback('accurate')}
                >
                  Accurate
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleFeedback('inaccurate')}
                >
                  Inaccurate
                </button>
              </div>
            </div>
          )}

          {feedbackSubmitted && (
            <div className="success" style={{ marginTop: '20px' }}>
              Thank you for your feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

