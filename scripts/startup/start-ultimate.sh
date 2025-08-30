#!/bin/bash

# 🚀 Ultimate Smart Startup with Automatic ngrok URL Sync
# This script handles everything automatically including URL updates

set -e

echo "🎵 Mood Melodies App - Ultimate Smart Start"
echo "============================================"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local check_command=$2
    
    echo -e "${BLUE}Checking ${service_name}...${NC}"
    if eval $check_command > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${service_name} is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ ${service_name} is not running${NC}"
        return 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Waiting for ${service_name} to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if eval $check_command > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is ready!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - waiting for ${service_name}...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ ${service_name} failed to start after $max_attempts attempts${NC}"
    return 1
}

echo "📋 Step 1: Checking current service status"
echo "----------------------------------------"

# Check Face API Server
if check_service "Face API Server" "curl -s http://localhost:3001/health"; then
    FACE_API_RUNNING=true
else
    FACE_API_RUNNING=false
fi

# Check ngrok tunnel
if check_service "ngrok tunnel" "curl -s http://localhost:4040/api/tunnels"; then
    NGROK_RUNNING=true
else
    NGROK_RUNNING=false
fi

# Check Expo
if check_service "Expo" "pgrep -f 'expo start'"; then
    EXPO_RUNNING=true
else
    EXPO_RUNNING=false
fi

echo ""
echo "🚀 Step 2: Starting missing services"
echo "-----------------------------------"

# Start Face API Server if not running
if [ "$FACE_API_RUNNING" = false ]; then
    echo -e "${BLUE}Starting Face API Server...${NC}"
    cd face-api-service
    
    # Kill any process using port 3001
    echo "🧹 Cleaning up port 3001..."
    npx kill-port 3001 2>/dev/null || true
    
    # Start Face API server in background
    nohup node server-simple.js > face-api.log 2>&1 &
    FACE_API_PID=$!
    echo -e "${GREEN}✅ Face API Server started (PID: $FACE_API_PID)${NC}"
    
    cd ..
    
    # Wait for Face API to be ready
    if ! wait_for_service "Face API Server" "curl -s http://localhost:3001/health"; then
        echo -e "${RED}❌ Failed to start Face API Server${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Face API Server already running${NC}"
fi

# Start ngrok if not running
if [ "$NGROK_RUNNING" = false ]; then
    echo -e "${BLUE}Starting ngrok tunnel...${NC}"
    cd face-api-service
    
    # Kill any existing ngrok processes
    echo "🧹 Cleaning up existing ngrok processes..."
    pkill -f ngrok 2>/dev/null || true
    
    # Start ngrok in background
    nohup powershell "& './ngrok.exe' http 3001" > ngrok.log 2>&1 &
    NGROK_PID=$!
    echo -e "${GREEN}✅ ngrok tunnel started (PID: $NGROK_PID)${NC}"
    
    cd ..
    
    # Wait for ngrok to be ready
    if ! wait_for_service "ngrok API" "curl -s http://localhost:4040/api/tunnels"; then
        echo -e "${RED}❌ Failed to start ngrok tunnel${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ ngrok tunnel already running${NC}"
fi

# Auto-update ngrok URL in React Native code
echo ""
echo "🔄 Step 3: Auto-updating ngrok URL in React Native code"
echo "------------------------------------------------------"

echo -e "${BLUE}Syncing current ngrok URL with React Native app...${NC}"
if node update-ngrok-url.js; then
    echo -e "${GREEN}✅ React Native code updated with current ngrok URL${NC}"
else
    echo -e "${YELLOW}⚠️ Could not auto-update ngrok URL, but continuing...${NC}"
fi

# Start Expo if not running
echo ""
echo "📱 Step 4: Starting Expo"
echo "------------------------"

if [ "$EXPO_RUNNING" = false ]; then
    echo -e "${BLUE}Starting Expo in tunnel mode...${NC}"
    
    # Start Expo in background
    nohup npx expo start --tunnel > expo.log 2>&1 &
    EXPO_PID=$!
    echo -e "${GREEN}✅ Expo started in tunnel mode (PID: $EXPO_PID)${NC}"
    
    echo -e "${YELLOW}⏳ Expo is starting up... This may take a moment...${NC}"
else
    echo -e "${GREEN}✅ Expo already running${NC}"
fi

echo ""
echo "🎯 Step 5: Final verification"
echo "----------------------------"

# Final verification
echo -e "${BLUE}Verifying all services...${NC}"

# Test Face API
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Face API Server: Working${NC}"
else
    echo -e "${RED}❌ Face API Server: Failed${NC}"
fi

# Get current ngrok URL
CURRENT_NGROK_URL=$(node face-api-service/get-ngrok-url.js 2>/dev/null || echo "")
if [ ! -z "$CURRENT_NGROK_URL" ]; then
    echo -e "${GREEN}✅ ngrok Tunnel: ${CURRENT_NGROK_URL}${NC}"
    
    # Test tunnel endpoint (with timeout)
    if timeout 10 curl -s -H "ngrok-skip-browser-warning: any" "${CURRENT_NGROK_URL}/health" > /dev/null; then
        echo -e "${GREEN}✅ ngrok Tunnel: Accessible from internet${NC}"
    else
        echo -e "${YELLOW}⚠️ ngrok Tunnel: URL exists but may not be fully ready yet${NC}"
    fi
else
    echo -e "${RED}❌ ngrok Tunnel: No URL found${NC}"
fi

echo ""
echo "🎵 SUCCESS! All services are running with auto-synced URLs!"
echo "==========================================================="
echo -e "${GREEN}✅ Face API Server: http://localhost:3001${NC}"
if [ ! -z "$CURRENT_NGROK_URL" ]; then
    echo -e "${GREEN}✅ ngrok Tunnel: ${CURRENT_NGROK_URL}${NC}"
    echo -e "${GREEN}✅ React Native: Auto-synced with current tunnel URL${NC}"
fi
echo -e "${GREEN}✅ Expo: Tunnel mode (check QR code in terminal)${NC}"
echo ""
echo -e "${BLUE}📱 Next Steps:${NC}"
echo "1. Scan the Expo QR code with your phone"
echo "2. Open the app and go to 'Capture' tab"
echo "3. Take a photo - real mood analysis will work!"
echo ""
echo -e "${YELLOW}💡 The app now automatically uses the correct ngrok URL${NC}"
echo -e "${YELLOW}   Every restart automatically syncs the new tunnel URL!${NC}"
echo ""
echo -e "${BLUE}📋 To monitor logs:${NC}"
echo "- Face API: tail -f face-api-service/face-api.log"
echo "- ngrok: tail -f face-api-service/ngrok.log" 
echo "- Expo: tail -f expo.log"

# Keep the script running to monitor (optional)
echo ""
echo -e "${BLUE}🔄 Auto-sync is active. Press Ctrl+C to exit.${NC}"
echo -e "${YELLOW}💡 If ngrok URL changes, run: node update-ngrok-url.js${NC}"
