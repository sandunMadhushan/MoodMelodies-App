#!/bin/bash

# 🚀 Automated Startup Script for Mood Melodies App
# Works on any laptop - automatically discovers network configuration

echo "🎵 Starting Mood Melodies App with Auto-Discovery..."
echo "🌐 This script works on ANY laptop without manual IP configuration!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if command_exists lsof; then
        lsof -i :$port >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -an | grep ":$port " >/dev/null 2>&1
    else
        return 1
    fi
}

# Function to get local IP addresses
get_local_ips() {
    echo "📡 Discovering local IP addresses..."
    
    if command_exists ipconfig; then
        # Windows
        ipconfig | grep "IPv4 Address" | grep -o "[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*" | head -5
    elif command_exists ifconfig; then
        # Mac/Linux
        ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -5
    elif command_exists hostname; then
        # Alternative
        hostname -I 2>/dev/null | tr ' ' '\n' | head -5
    else
        echo "Could not determine IP addresses automatically"
    fi
}

# Step 1: Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Step 2: Display network information
echo ""
echo "🌐 Network Discovery Results:"
echo "📍 Your computer will be accessible from these IPs:"
get_local_ips | while read -r ip; do
    if [ -n "$ip" ]; then
        echo "   • http://$ip:3001"
    fi
done
echo "   • http://localhost:3001 (local access)"
echo ""

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing main app dependencies..."
    npm install
fi

if [ ! -d "face-api-service/node_modules" ]; then
    echo "📦 Installing Face API service dependencies..."
    cd face-api-service
    npm install
    cd ..
fi

# Step 4: Start Face API service
echo ""
echo "🧠 Starting Face API Server..."

if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Face API server might already be running.${NC}"
    echo "Testing existing server..."
    
    if curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Face API server is already running and responding${NC}"
    else
        echo -e "${RED}❌ Port 3001 is occupied but server is not responding${NC}"
        echo "Please stop the process using port 3001 and try again"
        exit 1
    fi
else
    echo "Starting Face API service in background..."
    cd face-api-service
    
    # Start server in background
    npm start > ../face-api.log 2>&1 &
    SERVER_PID=$!
    
    cd ..
    
    # Wait for server to start
    echo "Waiting for Face API server to start..."
    for i in {1..10}; do
        if curl -s http://localhost:3001/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Face API server started successfully (PID: $SERVER_PID)${NC}"
            break
        fi
        
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Face API server failed to start after 10 seconds${NC}"
            echo "Check face-api.log for error details"
            kill $SERVER_PID 2>/dev/null
            exit 1
        fi
        
        echo "Waiting... ($i/10)"
        sleep 1
    done
fi

# Step 5: Test network connectivity
echo ""
echo "🧪 Testing network connectivity..."
node scripts/test-network.js

# Step 6: Start mobile app
echo ""
echo "📱 Starting Expo development server..."
echo -e "${BLUE}🎯 The app will automatically discover the correct Face API endpoint!${NC}"
echo -e "${BLUE}📲 No manual IP configuration needed - works on any laptop!${NC}"
echo ""

# Start Expo
npx expo start --clear --tunnel

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo "Face API server stopped"
    fi
    exit 0
}

# Handle Ctrl+C
trap cleanup INT TERM

# Wait for Expo to finish
wait
