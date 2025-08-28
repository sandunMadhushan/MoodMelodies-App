#!/bin/bash

echo "🧪 Testing Face API Service..."

# Check if service is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Service is running"
    
    # Test health endpoint
    echo "📋 Health check response:"
    curl -s http://localhost:3001/health | jq .
    
    echo ""
    echo "🎯 Service is ready for mobile app integration!"
    echo "📱 Start your React Native app and test the capture feature"
else
    echo "❌ Service is not running"
    echo "🚀 Start the service with:"
    echo "   cd face-api-service"
    echo "   npm start"
fi
