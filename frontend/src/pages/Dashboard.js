import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI, feedbackAPI } from '../services/api';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articleAPI.getArticles();
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <div className="navbar">
        <div className="navbar-content">
          <h1>Fake News Detection Platform</h1>
          <div className="navbar-actions">
            <span>Welcome, {user.username}</span>
            <button
              className="btn btn-primary"
              style={{ marginRight: '10px', padding: '5px 10px', fontSize: '14px' }}
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Articles</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/submit-article')}
          >
            Submit New Article
          </button>
        </div>

        {loading && <p>Loading articles...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && articles.length === 0 && (
          <div className="card">
            <p>No articles yet. Submit your first article to get started!</p>
          </div>
        )}

        {articles.map((article) => (
          <div key={article.article_id} className="card">
            <h3>{article.title}</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              By {article.user?.username} • {new Date(article.published_date).toLocaleDateString()}
            </p>
            <p>{article.content.substring(0, 200)}...</p>

            {article.prediction && (
              <div className={`prediction-result ${article.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`}>
                <h3>
                  {article.prediction.fake_probability > 0.5 ? '⚠️ Likely Fake' : '✓ Likely Real'}
                </h3>
                <div className="probability-bar">
                  <div
                    className={`probability-fill ${article.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`}
                    style={{ width: `${article.prediction.fake_probability * 100}%` }}
                  >
                    {Math.round(article.prediction.fake_probability * 100)}%
                  </div>
                </div>
                <p>Confidence: {Math.round(article.prediction.confidence_score * 100)}%</p>
              </div>
            )}

            <button
              className="btn btn-secondary"
              style={{ marginTop: '10px' }}
              onClick={() => navigate(`/article/${article.article_id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

