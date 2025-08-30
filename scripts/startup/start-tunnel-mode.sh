#!/bin/bash

# Mood Melodies - Tunnel Mode Startup Script
# Starts both Face API server and Expo app in tunnel mode for easy mobile access

set -e  # Exit on any error

echo "🚀 Starting Mood Melodies in Tunnel Mode"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "face-api-service" ]; then
    echo -e "${RED}❌ Error: Please run this script from the mood-melodies-app root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Tunnel Mode Setup for Mobile Access${NC}"
echo -e "${YELLOW}This will start both Face API server and Expo app in tunnel mode${NC}"
echo -e "${YELLOW}Perfect for testing on your actual phone!${NC}"
echo ""

# Function to kill processes on script exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up processes...${NC}"
    
    # Kill Face API server
    if [ ! -z "$FACE_API_PID" ]; then
        kill $FACE_API_PID 2>/dev/null || true
    fi
    
    # Kill Expo process
    if [ ! -z "$EXPO_PID" ]; then
        kill $EXPO_PID 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Setup cleanup on script exit
trap cleanup EXIT INT TERM

echo -e "${BLUE}🔧 Step 1: Starting Face API Server${NC}"
echo "  The Face API server will run on your computer's IP address"
echo "  This allows your phone to connect to it via tunnel mode"
echo ""

# Start Face API server in background
cd face-api-service
npm start > ../face-api.log 2>&1 &
FACE_API_PID=$!
cd ..

echo -e "${GREEN}✅ Face API server started (PID: $FACE_API_PID)${NC}"
echo "  Check face-api.log for server logs"

# Give server time to start
sleep 3

echo ""
echo -e "${BLUE}🔧 Step 2: Starting Expo in Tunnel Mode${NC}"
echo "  Expo tunnel mode allows your phone to connect from anywhere"
echo "  Scan the QR code with Expo Go app on your phone"
echo ""

# Start Expo in tunnel mode
npx expo start --tunnel > expo.log 2>&1 &
EXPO_PID=$!

echo -e "${GREEN}✅ Expo starting in tunnel mode (PID: $EXPO_PID)${NC}"
echo "  Check expo.log for Expo logs"

echo ""
echo -e "${BLUE}📱 Mobile Setup Instructions${NC}"
echo "============================================"
echo "1. Install Expo Go app on your phone:"
echo "   📱 iOS: Search 'Expo Go' in App Store"
echo "   🤖 Android: Search 'Expo Go' in Play Store"
echo ""
echo "2. Wait for Expo to generate the tunnel and QR code"
echo "   📊 Check expo.log file for the QR code and tunnel URL"
echo ""
echo "3. Scan the QR code with Expo Go app"
echo "   📷 Use the camera or QR scanner in Expo Go"
echo ""
echo "4. The app will load on your phone via tunnel mode"
echo "   🌐 Face API will automatically work through tunnel"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   • Keep this terminal open while testing"
echo "   • Face API logs: tail -f face-api.log"
echo "   • Expo logs: tail -f expo.log"
echo "   • Press Ctrl+C to stop both services"
echo ""

echo -e "${GREEN}🎯 Services Status:${NC}"
echo "   Face API Server: Running (background)"
echo "   Expo Tunnel:     Starting..."
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Wait for Expo to show the QR code (check expo.log)"
echo "2. Scan QR code with Expo Go app"
echo "3. Test mood analysis with your phone's camera"
echo ""

# Wait for user to press Ctrl+C
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running and show logs
tail -f expo.log &
TAIL_PID=$!

# Wait for interrupt
wait
