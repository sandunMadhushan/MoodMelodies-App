#!/bin/bash

# 🚀 Automated Startup Script for Mood Melodies App
# Works on any laptop - automatically discovers network configuration

echo "🎵 Mood Melodies - Quick Start Helper"
echo "======================================"
echo ""
echo -e "\033[1;33m📋 For better log visibility, use separate terminals:\033[0m"
echo ""
echo -e "\033[0;32mTerminal 1 (Face API Server):\033[0m"
echo "  Linux/Mac/Git Bash: ./start-face-api.sh"
echo "  Windows CMD:         start-face-api.bat"
echo ""
echo -e "\033[0;32mTerminal 2 (Expo Development):\033[0m"
echo "  Linux/Mac/Git Bash: ./start-expo.sh"
echo "  Windows CMD:         start-expo.bat"
echo ""
echo -e "\033[0;34m💡 The separate terminals will show logs independently!\033[0m"
echo ""
echo "Alternatively, continue below to start everything in one terminal:"
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

# Function to force kill processes on port 3001
kill_port_3001() {
    echo "🔧 Attempting to free port 3001..."
    
    # Try different methods to find and kill the process
    if command_exists lsof; then
        # Linux/Mac method
        PID=$(lsof -ti:3001 2>/dev/null)
        if [ -n "$PID" ]; then
            echo "Found process $PID using port 3001, killing it..."
            kill -9 $PID 2>/dev/null
            sleep 2
            return 0
        fi
    fi
    
    # Windows Git Bash method
    if command_exists taskkill; then
        echo "Attempting to kill Node.js processes..."
        taskkill //F //IM node.exe //T 2>/dev/null || echo "No node.exe processes found"
        sleep 2
        return 0
    fi
    
    # Alternative Windows method
    if command_exists powershell.exe; then
        echo "Using PowerShell to find and kill process..."
        powershell.exe -Command "
            \$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
            if (\$process) {
                Stop-Process -Id \$process -Force -ErrorAction SilentlyContinue
                Write-Host 'Killed process using port 3001'
            }
        " 2>/dev/null
        sleep 2
        return 0
    fi
    
    echo "⚠️  Could not automatically kill the process. Please manually stop any Node.js processes and try again."
    return 1
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

# Function to check if a port is in use
check_port() {
    local port=$1
    if command_exists lsof; then
        lsof -i :$port >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -an | grep ":$port " >/dev/null 2>&1
    else
        # Try to connect to the port
        timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null
    fi
}

# Step 4: Start Face API service
echo ""
echo "🧠 Starting Face API Server..."

if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Testing existing server...${NC}"
    
    if curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Face API server is already running and responding${NC}"
    else
        echo -e "${YELLOW}❌ Port 3001 is occupied but server is not responding${NC}"
        echo -e "${BLUE}🔧 Attempting to fix this automatically...${NC}"
        
        if kill_port_3001; then
            echo -e "${GREEN}✅ Successfully freed port 3001${NC}"
            sleep 2
        else
            echo -e "${RED}❌ Could not free port 3001 automatically${NC}"
            echo "Please manually stop any Node.js processes and run the script again"
            exit 1
        fi
    fi
fi

# Check if we need to start the server (either it wasn't running or we killed it)
if ! curl -s http://localhost:3001/health >/dev/null 2>&1; then
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
