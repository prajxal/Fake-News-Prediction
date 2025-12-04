pipeline {
  agent any
  environment {
    FRONTEND_DIR = "frontend"
    DOCKER_SSH   = "ssh://ubuntu@65.0.73.116"
    SSH_CRED_ID  = "docker-ec2-key"   // your Jenkins credential ID
    APP_NAME     = "fake-frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'ls -la && ls -la frontend || true'
      }
    }

    stage('Build & Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CRED_ID,
                                           keyFileVariable: 'SSH_KEY')]) {
          sh '''
            set -e

            # Use remote docker over SSH with *this* key
            export DOCKER_HOST="${DOCKER_SSH}"
            export DOCKER_SSH_COMMAND="ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no"

            echo "Using DOCKER_HOST=${DOCKER_HOST}"
            docker --version

            echo "Testing remote docker ps..."
            docker ps

            IMAGE="${APP_NAME}:${BUILD_ID}"

            echo "Building image ${IMAGE} from ${FRONTEND_DIR}..."
            docker build -t "${IMAGE}" "./${FRONTEND_DIR}"

            echo "Stopping old container (if any)..."
            docker rm -f "${APP_NAME}" || true

            echo "Running new container..."
            docker run -d --name "${APP_NAME}" -p 80:80 --restart unless-stopped "${IMAGE}"

            echo "Containers:"
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
