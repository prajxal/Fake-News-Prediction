// Jenkinsfile (place in repo root)
pipeline {
  agent any
  environment {
  FRONTEND_DIR = "frontend"
  DOCKER_SSH = "ssh://ubuntu@65.0.73.116"
  SSH_CRED_ID = "docker-ec2-key"   // must match the Jenkins credential ID
  APP_NAME = "fake-frontend"
}

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'ls -la && ls -la ${FRONTEND_DIR} || true'
      }
    }
    stage('Build & Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CRED_ID, keyFileVariable: 'SSH_KEY')]) {
          sh '''
            export DOCKER_HOST="${DOCKER_SSH}"
            echo "Using DOCKER_HOST=$DOCKER_HOST"
            docker --version
            docker ps || { echo "remote docker unreachable"; exit 2; }
            IMAGE=${APP_NAME}:${BUILD_ID}
            docker build -t ${IMAGE} ./${FRONTEND_DIR}
            docker rm -f ${APP_NAME} || true
            docker run -d --name ${APP_NAME} -p 80:80 --restart unless-stopped ${IMAGE}
            docker ps --filter "name=${APP_NAME}"
          '''
        }
      }
    }
  }
  post {
    success { echo "Deployed ${APP_NAME}:${BUILD_ID}" }
    failure { echo "Deploy failed" }
  }
}
