#!/bin/bash

echo "🧪 Testing Face API Service..."

# Navigate to face-api-service directory
cd face-api-service

echo "📍 Current directory: $(pwd)"
echo "📋 Files in directory:"
ls -la

echo ""
echo "🚀 Starting Face API Service..."
echo "   If successful, you should see:"
echo "   - 🚀 Face API service starting..."
echo "   - 📍 Server running on port 3001"
echo "   - ✅ Ready to receive requests!"
echo ""

# Start the server
node server-simple.js
