import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI } from '../services/api';

const SubmitArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await articleAPI.submitArticle(formData.title, formData.content);
      setResult(response.data);
      
      // Clear form
      setFormData({ title: '', content: '' });
      
      // Optionally redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2>Submit Article for Analysis</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Article Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={500}
                placeholder="Enter article title"
              />
            </div>
            <div className="form-group">
              <label>Article Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                minLength={50}
                placeholder="Enter article content (minimum 50 characters)"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing...' : 'Submit & Analyze'}
            </button>
          </form>

          {result && result.prediction && (
            <div className={`prediction-result ${result.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`} style={{ marginTop: '20px' }}>
              <h3>
                {result.prediction.fake_probability > 0.5 ? '⚠️ Likely Fake News' : '✓ Likely Real News'}
              </h3>
              <div className="probability-bar">
                <div
                  className={`probability-fill ${result.prediction.fake_probability > 0.5 ? 'fake' : 'real'}`}
                  style={{ width: `${result.prediction.fake_probability * 100}%` }}
                >
                  {Math.round(result.prediction.fake_probability * 100)}% Fake Probability
                </div>
              </div>
              <p><strong>Confidence Score:</strong> {Math.round(result.prediction.confidence_score * 100)}%</p>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitArticle;

