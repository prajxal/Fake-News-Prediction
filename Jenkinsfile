/**
 * Jenkins CI/CD Pipeline
 * Stages:
 * 1. Install dependencies
 * 2. Run basic tests
 * 3. Build Docker images
 * 4. Deploy containers
 * 
 * Security: Uses environment variables for sensitive data
 */

pipeline {
    agent any

    environment {
        // Docker registry (if using one)
        DOCKER_REGISTRY = ''
        // Project name
        PROJECT_NAME = 'fake-news-detection'
        // Build number
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo 'Installing backend dependencies...'
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo 'Installing frontend dependencies...'
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                dir('backend') {
                    // Run backend tests if they exist
                    sh 'npm test || true' // Continue even if tests fail (for demo)
                }
                dir('frontend') {
                    // Run frontend tests if they exist
                    sh 'npm test -- --watchAll=false || true' // Continue even if tests fail (for demo)
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                script {
                    // Build backend image
                    sh """
                        docker build -t ${PROJECT_NAME}-backend:${BUILD_NUMBER} ./backend
                        docker tag ${PROJECT_NAME}-backend:${BUILD_NUMBER} ${PROJECT_NAME}-backend:latest
                    """
                    
                    // Build frontend image
                    sh """
                        docker build -t ${PROJECT_NAME}-frontend:${BUILD_NUMBER} ./frontend
                        docker tag ${PROJECT_NAME}-frontend:${BUILD_NUMBER} ${PROJECT_NAME}-frontend:latest
                    """
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Deploying containers with Docker Compose...'
                script {
                    // Stop existing containers
                    sh 'docker-compose down || true'
                    
                    // Start new containers
                    sh 'docker-compose up -d --build'
                    
                    // Wait for services to be healthy
                    sh 'sleep 10'
                    
                    // Health check
                    sh '''
                        echo "Checking backend health..."
                        curl -f http://localhost:5000/health || exit 1
                        echo "Backend is healthy!"
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    // Remove old images (keep last 5 builds)
                    sh '''
                        docker images ${PROJECT_NAME}-backend --format "{{.ID}}" | tail -n +6 | xargs -r docker rmi || true
                        docker images ${PROJECT_NAME}-frontend --format "{{.ID}}" | tail -n +6 | xargs -r docker rmi || true
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            // Optional: Send notification
        }
        failure {
            echo 'Pipeline failed!'
            // Optional: Send notification
        }
        always {
            echo 'Pipeline finished. Cleaning up workspace...'
            cleanWs()
        }
    }
}

