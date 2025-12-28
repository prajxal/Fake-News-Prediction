# Fake News Detection Platform

A production-style Fake News Detection platform built with MongoDB, Node.js, React, featuring secure authentication, ML integration, and CI/CD using Jenkins and Docker.

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Frontend**: React
- **Authentication**: JWT + bcrypt
- **DevOps**: Docker + Docker Compose + Jenkins
- **ML**: Pre-trained model integration (HuggingFace/sklearn)

### Project Structure
```
project-root/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth middleware
│   │   └── utils/       # ML service
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── services/    # API service
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── ml-model/             # ML model files
├── docker-compose.yml    # Full-stack orchestration
├── Jenkinsfile           # CI/CD pipeline
└── README.md
```

## 📊 Database Schema

### User
- `user_id` (ObjectId)
- `username` (unique)
- `email` (unique)
- `password_hash` (bcrypt)
- `reputation_score`
- `created_at`

### Article
- `article_id` (ObjectId)
- `title`
- `content`
- `user_id` (ref User)
- `published_date`

### Prediction
- `prediction_id` (ObjectId)
- `article_id` (ref Article)
- `fake_probability` (0-1)
- `confidence_score` (0-1)
- `predicted_at`

### Feedback
- `feedback_id` (ObjectId)
- `article_id` (ref Article)
- `user_id` (ref User)
- `feedback_type` (accurate/inaccurate/helpful/not_helpful)
- `created_at`

## 🔐 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Token-based auth with 7-day expiration
3. **Protected Routes**: Middleware validates JWT on protected endpoints
4. **Input Validation**: express-validator for request validation
5. **Environment Variables**: Sensitive data stored in .env files
6. **Password Exclusion**: Password hashes never exposed in JSON responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or use Docker)
- Docker & Docker Compose
- Jenkins (for CI/CD)

### Local Development

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm start
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### 3. MongoDB Setup
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
```

### Docker Deployment

#### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

#### Individual Docker Builds
```bash
# Backend
cd backend
docker build -t fake-news-backend .
docker run -p 5000:5000 --env-file .env fake-news-backend

# Frontend
cd frontend
docker build -t fake-news-frontend .
docker run -p 3000:80 fake-news-frontend
```

## 🔄 CI/CD with Jenkins

### Jenkins Setup

1. **Install Jenkins Plugins**:
   - Docker Pipeline
   - Docker
   - Git

2. **Configure Jenkins**:
   ```bash
   # Create new Pipeline job
   # Point to Jenkinsfile in repository
   # Configure credentials if needed
   ```

3. **Run Pipeline**:
   - Jenkins automatically detects Jenkinsfile
   - Pipeline stages:
     1. Checkout code
     2. Install dependencies (backend + frontend)
     3. Run tests
     4. Build Docker images
     5. Deploy containers
     6. Cleanup old images

### Manual Pipeline Trigger
```bash
# In Jenkins UI, click "Build Now"
# Or use Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080 build fake-news-detection
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Articles (Protected)
- `POST /api/articles` - Submit article for analysis
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID

### Feedback (Protected)
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/article/:articleId` - Get feedback for article

### Health Check
- `GET /health` - API health status

## 🤖 ML Model Integration

### Current Implementation
The platform uses a heuristic-based approach for demonstration. To integrate a real ML model:

1. **Place model files** in `ml-model/` directory
2. **Update** `backend/src/utils/mlService.js`
3. **Install ML libraries**:
   ```bash
   npm install @huggingface/inference  # For HuggingFace
   # OR
   npm install python-shell            # For sklearn pickle
   ```

### Example Model Integration
See `ml-model/README.md` for detailed integration examples.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/fake_news_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
ML_MODEL_PATH=./ml-model/fake_news_model.pkl
```

### Frontend
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Viva Explanation Points

### Security
1. **bcrypt with Salt**: 10 rounds balance security/performance
2. **JWT Tokens**: Stateless authentication, 7-day expiration
3. **Protected Routes**: Middleware validates tokens
4. **Input Validation**: Prevents injection attacks
5. **Password Exclusion**: Never expose hashes in responses

### DevOps
1. **Docker**: Containerization for consistent deployments
2. **Multi-stage Builds**: Optimized production images
3. **Docker Compose**: Orchestrates full stack
4. **Jenkins Pipeline**: Automated CI/CD
5. **Health Checks**: Service monitoring

### Database Design
1. **Mongoose ODM**: Type-safe schema definitions
2. **Indexes**: Optimized queries (email, username, dates)
3. **References**: Proper relationships between collections
4. **Validation**: Schema-level data validation

### ML Integration
1. **Service Layer**: Isolated ML logic
2. **Async Processing**: Non-blocking predictions
3. **Fallback**: Graceful error handling
4. **Extensible**: Easy to swap models

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Check connection string
echo $MONGODB_URI
```

### Port Conflicts
```bash
# Change ports in docker-compose.yml
# Or stop conflicting services
lsof -i :5000  # Check what's using port 5000
```

### Docker Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)

## 📄 License

This project is for academic evaluation purposes.

## 👥 Author

Built for 5th Semester Academic Project - Fake News Detection Platform

---

**Note**: This is a production-style implementation optimized for viva explanation. Code clarity and security best practices are prioritized over feature overload.

