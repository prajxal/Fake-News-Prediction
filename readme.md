## Fake News Detection Platform

Modern web application for detecting and analysing potentially fake news articles, built with React, Node.js/Express, and MongoDB Atlas, with CI powered by GitHub Actions and Jenkins.

---

## Project Overview

- **Goal**: Provide a demonstration-grade, production-style platform where users can:
  - Register and authenticate securely.
  - Submit news articles for analysis.
  - View fake/real likelihood and confidence scores.
  - Provide feedback on prediction results.
- **Context**: Designed for academic evaluation and viva, with emphasis on:
  - Clear separation of frontend, backend, and database.
  - Secure authentication and authorization.
  - Modern CI practices using GitHub Actions and Jenkins.

---

## Tech Stack

- **Frontend**
  - React (Create React App)
  - React Router for client-side routing
  - Axios for HTTP requests

- **Backend**
  - Node.js + Express
  - Mongoose for MongoDB ODM
  - JSON Web Tokens (JWT) for authentication
  - bcrypt for password hashing
  - express-validator for input validation

- **Database**
  - MongoDB Atlas (managed cloud MongoDB)

- **CI/CD & DevOps**
  - **Primary CI**: GitHub Actions (linting, build validation)
  - **Secondary CI (Demonstration)**: Jenkins Pipeline on AWS EC2 (checkout, install, lint, build, Docker validation)
  - **Containerization**: Docker (for local development and CI validation only; not used in production)
  - Environment variables for configuration (no secrets in the repository)

- **Hosting / Cloud**
  - **Frontend**: Vercel
  - **Backend**: Render
  - **Database**: MongoDB Atlas

---

## Project Structure

```text
project-root/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── models/        # MongoDB schemas (User, Article, Prediction, Feedback)
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth & validation middleware
│   │   └── utils/         # ML service and helpers
│   ├── package.json
│   └── jest.config.js
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard, SubmitArticle, ArticleDetail
│   │   ├── services/      # Centralized API client (Axios)
│   │   ├── index.js
│   │   └── App.js
│   └── package.json
├── ml-model/              # ML model documentation / sample files
├── backend/
│   └── Dockerfile         # Docker image for backend (local dev & CI validation only)
├── frontend/
│   └── Dockerfile         # Docker image for frontend (local dev & CI validation only)
├── .github/workflows/     # GitHub Actions CI workflow(s)
├── Jenkinsfile            # Jenkins CI pipeline (CI only, no deployment)
└── README.md
```

---

## System Architecture

### High-Level Architecture (Text Description)

- **Client (Browser / React on Vercel)**
  - Renders the UI, handles routing, manages local state, and stores JWT in `localStorage`.
  - Communicates with the backend via HTTPS using a base API URL (e.g., `https://<render-backend>/api`).

- **Backend API (Node.js/Express on Render)**
  - Exposes REST endpoints under the `/api` prefix:
    - `/api/auth/*` for authentication.
    - `/api/articles/*` for article submission and retrieval.
    - `/api/feedback/*` for user feedback.
  - Handles authentication, authorization, validation, and business logic.
  - Interacts with MongoDB Atlas via Mongoose models.

- **Database (MongoDB Atlas)**
  - Stores collections for:
    - Users
    - Articles
    - Predictions
    - Feedback
  - Hosted as a managed cloud database.

### Authentication & Authorization

- Users register and log in via `/api/auth/register` and `/api/auth/login`.
- Backend issues a signed JWT, which the frontend stores in `localStorage`.
- Subsequent requests include `Authorization: Bearer <token>` header.
- Protected routes on the backend use middleware to verify and decode the token.

---

## CI/CD Overview

### GitHub Actions (Primary CI)

- Location: `.github/workflows/ci.yml`
- **Purpose**: Primary continuous integration pipeline for this repository.
- **Key responsibilities**:
  - Trigger on pushes and pull requests to `main`.
  - Use Node.js 20.x.
  - Install dependencies in `backend/` and `frontend/` using `npm ci`.
  - Run ESLint for backend and frontend.
  - Build the frontend to ensure it compiles successfully.
- **Scope**: Static checks only (lint + build). No deployment or secrets required.

### Jenkins on AWS EC2 (Secondary / Demonstration CI)

- Location: `Jenkinsfile` at the repository root.
- Execution environment: Jenkins server (e.g., running on AWS EC2).
- **Purpose**: Demonstrate Jenkins-based CI concepts for academic/DevOps learning.
- **Key responsibilities**:
  - Checkout the repository.
  - Install backend dependencies using `npm ci`.
  - Run backend linting (non-blocking: pipeline continues even if lint finds issues).
  - Install frontend dependencies using `npm ci`.
  - Run frontend linting (non-blocking).
  - Build the frontend application using `npm run build`.
  - Validate Docker image builds (builds images to verify Dockerfiles are correct, but does not deploy).
- **Important**:
  - Jenkins pipeline does **not** perform any deployment.
  - Docker build stage is for CI validation only (ensures Dockerfiles are syntactically correct).
  - No cloud credentials are required for the Jenkins job itself.

---

## Deployment

### Frontend (Vercel)

- The React application is deployed to Vercel.
- Typical deployment flow:
  - Vercel is connected to the GitHub repository.
  - On push to the configured branch (e.g., `main`), Vercel:
    - Checks out the code.
    - Installs dependencies.
    - Runs `npm run build`.
    - Serves the generated static assets.
- Environment variables (e.g., `REACT_APP_API_URL`) are configured in Vercel project settings.

### Backend (Render)

- The Node.js/Express backend is deployed as a web service on Render.
- Typical deployment flow:
  - Render pulls the repository or a specific backend directory.
  - Installs dependencies with `npm install` / `npm ci`.
  - Starts the server with the configured start command (e.g., `node src/server.js`).
- Backend environment variables (e.g., `MONGODB_URI`, `JWT_SECRET`, `PORT`) are configured in Render’s dashboard.
- The backend exposes its API under `/api/*` and a `/health` endpoint for basic health checks.

### Database (MongoDB Atlas)

- MongoDB Atlas hosts the production database cluster.
- Connection string (URI) is provided to the backend via environment variables.
- No database credentials or URIs are committed to the repository.

---

## Monitoring & Logging

- **Render (Backend)**
  - Provides application logs for each deployment.
  - Health checks can be configured against the `/health` endpoint.
  - Logs can be viewed via Render’s web console.

- **Vercel (Frontend)**
  - Provides build logs and runtime logs for serverless functions (if any).
  - Deployment status and history are visible in the Vercel dashboard.

- **MongoDB Atlas**
  - Provides monitoring for cluster metrics, connection statistics, and query performance.

- **No Prometheus/Grafana stack**
  - Monitoring is intentionally kept cloud-native using platform-provided dashboards and logs.

---

## Local Development

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)
- A MongoDB Atlas cluster (or local MongoDB instance for development)
- Docker (optional, for containerized local development)

### Backend Setup

**Option 1: Direct Node.js (Recommended for development)**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI, JWT_SECRET, and other settings
npm start
```

**Option 2: Docker (Optional)**
```bash
cd backend
docker build -t fake-news-backend .
docker run -p 5000:5000 --env-file .env fake-news-backend
```

### Frontend Setup

**Option 1: Direct Node.js (Recommended for development)**
```bash
cd frontend
npm install
# For local dev, point API URL to your backend
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
npm start
```

**Option 2: Docker (Optional)**
```bash
cd frontend
docker build -t fake-news-frontend .
docker run -p 3000:80 -e REACT_APP_API_URL=http://localhost:5000 fake-news-frontend
```

### Docker Usage Notes

- **Purpose**: Docker is used for local development support and CI validation only.
- **Production**: Docker is **NOT** used in production. Frontend is deployed on Vercel, backend on Render.
- **CI Validation**: Jenkins pipeline includes a Docker build stage to validate Dockerfiles, but does not deploy containers.
- **No docker-compose**: This project does not use docker-compose for orchestration.

### Basic API Endpoints

- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login (returns JWT)
- `POST /api/articles` – Submit article for analysis (protected)
- `GET /api/articles` – Get all articles (protected)
- `GET /api/articles/:id` – Get article by ID (protected)
- `POST /api/feedback` – Submit feedback on an article (protected)
- `GET /api/feedback/article/:articleId` – Get feedback for an article (protected)
- `GET /health` – Backend health check

---

## Security Highlights

- **Password hashing**: bcrypt with a suitable number of salt rounds.
- **JWT authentication**: Stateless auth with token expiry.
- **Protected routes**: Middleware validates JWT on secured endpoints.
- **Input validation**: `express-validator` used on critical endpoints.
- **Sensitive data**: Managed via environment variables; no secrets in the codebase.

---

## Project Links

- **GitHub Repository**: `https://github.com/prajxal/Fake-News-Prediction.git`
- **Frontend (Vercel)**: `http://fake-news-prediction-tau.vercel.app/`
- **Backend (Render)**: `https://fake-news-prediction-dv8x.onrender.com/`


---

## License & Academic Note

- This project is intended for academic evaluation and learning purposes.
- Emphasis is placed on clean architecture, security best practices, and modern CI/CD practices rather than feature completeness.
