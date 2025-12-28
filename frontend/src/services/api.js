/**
 * API Service
 * Handles all HTTP requests to the backend
 * Manages JWT token storage and authentication headers
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

// Article API
export const articleAPI = {
  submitArticle: (title, content) =>
    api.post('/articles', { title, content }),
  
  getArticles: () =>
    api.get('/articles'),
  
  getArticleById: (id) =>
    api.get(`/articles/${id}`)
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: (article_id, feedback_type) =>
    api.post('/feedback', { article_id, feedback_type }),
  
  getFeedbackByArticle: (articleId) =>
    api.get(`/feedback/article/${articleId}`)
};

export default api;

