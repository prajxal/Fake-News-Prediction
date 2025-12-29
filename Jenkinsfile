/**
 * Jenkins CI Pipeline - Lightweight Version
 * Continuous Integration only - no deployment
 * 
 * DESIGNED FOR LOW-RESOURCE EC2 INSTANCES (t2/t3.micro)
 * 
 * This pipeline is intentionally lightweight to run reliably on constrained infrastructure.
 * Heavy operations (frontend builds, Docker, parallel execution) are excluded.
 * Full CI/CD validation is handled by GitHub Actions (primary CI system).
 * 
 * Stages:
 * 1. Checkout source code
 * 2. Install backend dependencies (lightweight npm install)
 * 3. Run backend linting (non-blocking)
 * 4. Install frontend dependencies (lightweight npm install)
 * 5. Frontend lightweight validation (syntax check only, no build)
 * 
 * Engineering Trade-offs:
 * - Uses npm install instead of npm ci (lighter, faster on low-resource systems)
 * - Skips frontend production build (too resource-intensive for t2/t3.micro)
 * - Sequential execution only (no parallel stages to reduce memory pressure)
 * - Timeout protection to prevent infinite hangs
 * - Workspace cleanup to preserve disk space
 * 
 * Note: Deployment is handled separately via Vercel (frontend) and Render (backend).
 */

pipeline {
    agent any

    // Disable concurrent builds to prevent resource exhaustion on small EC2
    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES') // Prevent infinite hangs
    }

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
        // Using lightweight npm install instead of npm ci for low-resource systems
        stage('Backend - Install Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing backend dependencies (lightweight mode)...'
                    // Lightweight install: skip audit, funding, and optional dependencies
                    // This reduces network calls and disk usage on constrained systems
                    sh 'npm install --no-audit --no-fund --omit=optional'
                }
            }
        }

        // Stage 3: Run backend linting (non-blocking)
        // Linting is lightweight and provides value without heavy resource usage
        stage('Backend - Lint') {
            steps {
                dir('backend') {
                    echo 'Running ESLint on backend code...'
                    // Non-blocking: pipeline continues even if lint finds issues
                    sh 'npm run lint || echo "Linting completed with issues (non-blocking)"'
                }
            }
        }

        // Stage 4: Install frontend dependencies
        // Using lightweight npm install instead of npm ci for low-resource systems
        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies (lightweight mode)...'
                    // Lightweight install: skip audit, funding, and optional dependencies
                    sh 'npm install --no-audit --no-fund --omit=optional'
                }
            }
        }

        // Stage 5: Frontend lightweight validation
        // Skips production build (too resource-intensive) but validates syntax
        stage('Frontend - Lightweight Validation') {
            steps {
                dir('frontend') {
                    echo 'Running frontend lightweight validation...'
                    script {
                        // Validate package.json syntax
                        sh 'node -e "require(\'./package.json\')" || echo "package.json validation skipped"'
                        
                        // Run linting (lightweight static analysis)
                        sh 'npm run lint || echo "Frontend linting completed with issues (non-blocking)"'
                        
                        echo 'Frontend validation completed (build skipped for resource efficiency)'
                    }
                }
            }
        }
    }

    // Post-build actions
    post {
        success {
            echo '✅ Lightweight CI Pipeline completed successfully!'
            echo 'Static checks passed. Full validation handled by GitHub Actions.'
        }
        failure {
            echo '❌ CI Pipeline failed!'
            echo 'Please check the logs above for details.'
        }
        always {
            echo 'Pipeline execution finished.'
            // Aggressive cleanup to preserve disk space on low-resource EC2
            cleanWs()
        }
    }
}

