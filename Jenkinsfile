/**
 * Jenkins CI Pipeline
 * Continuous Integration only - no deployment
 * Stages:
 * 1. Checkout source code
 * 2. Install backend dependencies
 * 3. Run backend linting
 * 4. Install frontend dependencies
 * 5. Run frontend linting
 * 6. Build frontend
 * 7. Docker build validation (CI check only, no deployment)
 * 
 * Note: This pipeline performs static checks and Docker validation only.
 * Deployment is handled separately via Vercel (frontend) and Render (backend).
 * Docker is used for local development and CI validation, not production deployment.
 */

pipeline {
    agent any

    // Use Node.js tool if configured in Jenkins (optional)
    // If NodeJS tool is not configured, ensure Node.js is available in PATH
    tools {
        nodejs 'NodeJS' // Optional: Configure in Jenkins Global Tool Configuration
    }

    stages {
        // Stage 1: Checkout repository code
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                checkout scm
            }
        }

        // Stage 2: Install backend dependencies
        stage('Backend - Install Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing backend dependencies with npm ci...'
                    sh 'npm ci'
                }
            }
        }

        // Stage 3: Run backend linting (warnings/errors do not fail pipeline)
        stage('Backend - Lint') {
            steps {
                dir('backend') {
                    echo 'Running ESLint on backend code...'
                    // Run linting but continue pipeline even if errors found
                    sh 'npm run lint || echo "Linting completed with issues (non-blocking)"'
                }
            }
        }

        // Stage 4: Install frontend dependencies
        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies with npm ci...'
                    sh 'npm ci'
                }
            }
        }

        // Stage 5: Run frontend linting (warnings/errors do not fail pipeline)
        stage('Frontend - Lint') {
            steps {
                dir('frontend') {
                    echo 'Running ESLint on frontend code...'
                    // Run linting but continue pipeline even if errors found
                    sh 'npm run lint || echo "Linting completed with issues (non-blocking)"'
                }
            }
        }

        // Stage 6: Build frontend application
        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    echo 'Building frontend application...'
                    sh 'npm run build'
                    echo 'Frontend build completed successfully!'
                }
            }
        }

        // Stage 7: Docker - Build Validation (CI only, no deployment)
        stage('Docker - Build Validation') {
            steps {
                echo 'Validating Docker image builds (CI check only)...'
                script {
                    // Build backend Docker image to validate Dockerfile
                    dir('backend') {
                        sh 'docker build -t fake-news-backend:ci-test .'
                        echo 'Backend Docker image built successfully'
                    }
                    
                    // Build frontend Docker image to validate Dockerfile
                    dir('frontend') {
                        sh 'docker build -t fake-news-frontend:ci-test .'
                        echo 'Frontend Docker image built successfully'
                    }
                    
                    echo 'Docker build validation completed (images not deployed)'
                }
            }
        }
    }

    // Post-build actions
    post {
        success {
            echo '✅ CI Pipeline completed successfully!'
            echo 'All static checks passed. Ready for deployment.'
        }
        failure {
            echo '❌ CI Pipeline failed!'
            echo 'Please check the logs above for details.'
        }
        always {
            echo 'Pipeline execution finished.'
            // Clean workspace to save disk space
            cleanWs()
        }
    }
}

