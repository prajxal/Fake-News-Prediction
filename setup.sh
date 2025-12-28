#!/bin/bash

# Setup script for Fake News Detection Platform
# This script helps set up the project for local development

echo "🚀 Setting up Fake News Detection Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed (optional)
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker Compose setup will not work."
fi

# Setup Backend
echo "📦 Setting up backend..."
cd backend
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file from env.example"
        echo "⚠️  Please edit backend/.env with your configuration"
    else
        echo "⚠️  env.example not found. Please create .env manually"
    fi
else
    echo "✅ Backend .env already exists"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi
cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi
cd ..

# Create ML model directory if it doesn't exist
if [ ! -d "ml-model" ]; then
    mkdir -p ml-model
    echo "✅ Created ml-model directory"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT_SECRET"
echo "2. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:7.0"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Or use Docker Compose: docker-compose up -d --build"
echo ""
echo "📚 See README.md and QUICK_START.md for more details"

