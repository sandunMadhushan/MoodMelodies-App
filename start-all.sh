#!/bin/bash

# =============================================================================
# 🚀 MOOD MELODIES APP - COMPLETE STARTUP SCRIPT
# =============================================================================
# This script starts all services needed for the app:
# 1. Face API Service (localhost:3001)
# 2. ngrok tunnel (public access to Face API)
# 3. Updates app with ngrok URL
# 4. Starts Expo in tunnel mode
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if netstat -an | grep ":$port " | grep LISTEN > /dev/null; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    print_status "Cleaning up port $port..."
    if check_port $port; then
        npx kill-port $port
        sleep 2
    fi
}

# Function to start service in new terminal
start_in_new_terminal() {
    local title=$1
    local command=$2
    print_status "Starting $title in new terminal..."
    
    # For Windows Git Bash
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start bash -c "echo 'Starting $title...' && $command; read -p 'Press Enter to close...'"
    # For Linux/Mac
    else
        gnome-terminal --title="$title" -- bash -c "$command; read -p 'Press Enter to close...'"
    fi
}

# Main execution
echo -e "${PURPLE}"
echo "=================================================================="
echo "🎵 MOOD MELODIES APP - COMPLETE STARTUP 🎵"
echo "=================================================================="
echo -e "${NC}"

print_step "1/5 Cleaning up existing processes..."
kill_port 3001
kill_port 8081

print_step "2/5 Starting Face API Service..."
start_in_new_terminal "Face API Service" "cd \"$(pwd)\" && node face-api-service/server-simple.js"

print_status "Waiting for Face API service to start..."
sleep 5

# Check if Face API is running
if check_port 3001; then
    print_success "Face API service is running on port 3001"
else
    print_error "Face API service failed to start"
    exit 1
fi

print_step "3/5 Starting ngrok tunnel..."
start_in_new_terminal "ngrok Tunnel" "cd \"$(pwd)\" && ./tools/ngrok/ngrok.exe http 3001"

print_status "Waiting for ngrok tunnel to establish..."
sleep 8

print_step "4/5 Updating app with ngrok URL..."
if [ -f "tools/ngrok/update-ngrok-url.js" ]; then
    node tools/ngrok/update-ngrok-url.js
    print_success "App updated with ngrok URL"
else
    print_warning "ngrok URL update script not found, manual update may be needed"
fi

print_step "5/5 Starting Expo in tunnel mode..."
start_in_new_terminal "Expo Dev Server" "cd \"$(pwd)\" && npx expo start --tunnel --clear"

echo -e "${GREEN}"
echo "=================================================================="
echo "🎉 ALL SERVICES STARTED SUCCESSFULLY! 🎉"
echo "=================================================================="
echo "✅ Face API Service: http://localhost:3001"
echo "✅ ngrok Tunnel: Check ngrok terminal for public URL"
echo "✅ Expo Dev Server: Check Expo terminal for QR code"
echo ""
echo "📱 Scan the QR code with Expo Go app to test on your phone"
echo "🔍 The app will use real mood analysis via ngrok tunnel"
echo "=================================================================="
echo -e "${NC}"

print_status "Startup complete! Check individual terminals for service status."
