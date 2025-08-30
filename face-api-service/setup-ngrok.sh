#!/bin/bash

# Ngrok Setup for Face API Server
# This script helps you set up ngrok tunnel for real face analysis in tunnel mode

echo "🌐 Ngrok Face API Tunnel Setup"
echo "==============================="
echo ""

# Check if ngrok is available
if [ ! -f "ngrok.exe" ]; then
    echo "❌ ngrok.exe not found in current directory"
    echo "Please make sure ngrok is extracted in the face-api-service folder"
    exit 1
fi

echo "✅ Ngrok found: $(powershell "& './ngrok.exe' version")"
echo ""

# Check if Face API server is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Face API server not running on port 3001"
    echo "Please start it first:"
    echo "   cd .."
    echo "   ./start-face-api.sh"
    exit 1
fi

echo "✅ Face API server is running on port 3001"
echo ""

echo "📋 Ngrok Auth Setup Required:"
echo "1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken"
echo "2. Copy your authtoken"
echo "3. Run: powershell \"& './ngrok.exe' config add-authtoken YOUR_TOKEN\""
echo ""

echo "🚀 To start the tunnel after auth setup:"
echo "   powershell \"& './ngrok.exe' http 3001\""
echo ""

echo "💡 This will create a public URL like: https://abc123.ngrok.io"
echo "   The mobile app will then be able to reach Face API for real analysis!"
echo ""

read -p "Press Enter when you're ready to continue with auth setup..."

echo ""
echo "Please paste your authtoken from https://dashboard.ngrok.com:"
read -r AUTHTOKEN

if [ -n "$AUTHTOKEN" ]; then
    echo "🔑 Setting up authtoken..."
    powershell "& './ngrok.exe' config add-authtoken $AUTHTOKEN"
    
    if [ $? -eq 0 ]; then
        echo "✅ Authtoken configured successfully!"
        echo ""
        echo "🚀 Starting ngrok tunnel for Face API..."
        echo "   This will create a public URL for your Face API server"
        echo "   Keep this terminal open while testing!"
        echo ""
        
        # Start the tunnel
        powershell "& './ngrok.exe' http 3001"
    else
        echo "❌ Failed to configure authtoken"
        echo "Please check the token and try again"
    fi
else
    echo "❌ No authtoken provided"
    echo "Please run the script again with your authtoken"
fi
