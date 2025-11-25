#!/bin/bash
# START-SERVER.sh - Easy server startup script

echo "========================================="
echo "  Campus Resource Booking System"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "  macOS: brew install node"
    echo "  Windows: Download from https://nodejs.org"
    echo "  Linux: sudo apt install nodejs npm"
    echo ""
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Create database directory if it doesn't exist
if [ ! -d "database" ]; then
    echo "📁 Creating database directory..."
    mkdir -p database
fi

echo "🚀 Starting server..."
echo ""
echo "========================================="
echo "  Server will start on http://localhost:3000"
echo "========================================="
echo ""
echo "📝 How to use:"
echo "  1. Open your browser"
echo "  2. Go to: http://localhost:3000"
echo "  3. To stop server: Press Ctrl+C"
echo ""
echo "👤 Demo Accounts:"
echo "  Admin:   admin@concordia.ca / admin123"
echo "  Student: student@concordia.ca / student123"
echo ""
echo "========================================="
echo ""

# Start the server
npm start
