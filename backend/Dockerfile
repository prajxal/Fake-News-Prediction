# Backend Dockerfile
# For local development and CI validation only
# Production deployment uses Render (not Docker)

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for local dev)
RUN npm ci

# Copy application source code
COPY . .

# Expose port
EXPOSE 5000

# Use npm start (which runs "node src/server.js")
# Environment variables should be provided at runtime via -e or .env file
CMD ["npm", "start"]

