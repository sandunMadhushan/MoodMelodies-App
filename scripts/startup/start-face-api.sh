#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Face API Server Startup${NC}"
echo "=================================="
echo ""

# Check if face-api-service directory exists
if [ ! -d "face-api-service" ]; then
    echo -e "${RED}❌ face-api-service directory not found!${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Function to check if port is in use
check_port() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$port >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -an | grep ":$port " >/dev/null 2>&1
    else
        # For Windows/Git Bash - try curl
        curl -s http://localhost:$port >/dev/null 2>&1
    fi
}

# Function to kill process on port
kill_port_process() {
    local port=$1
    echo "Attempting to free port $port..."
    
    if command -v lsof >/dev/null 2>&1; then
        # Unix/Linux/macOS
        local pid=$(lsof -ti :$port)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null
            sleep 1
            return 0
        fi
    elif command -v tasklist >/dev/null 2>&1; then
        # Windows - use PowerShell command that works in Git Bash
        powershell.exe -Command "Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }" 2>/dev/null
        sleep 2
        return 0
    fi
    
    return 1
}

# Check and handle port 3001
if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use${NC}"
    
    # Check if it's our Face API server
    if curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Face API server is already running!${NC}"
        echo "Face API server is ready at http://localhost:3001"
        echo ""
        echo -e "${BLUE}📋 Logs will appear below:${NC}"
        echo "Press Ctrl+C to stop the server"
        
        # Just tail the existing log file
        if [ -f "face-api.log" ]; then
            tail -f face-api.log
        else
            echo "Monitoring existing server..."
            while curl -s http://localhost:3001/health >/dev/null 2>&1; do
                sleep 5
            done
            echo -e "${RED}❌ Face API server stopped${NC}"
        fi
        exit 0
    else
        echo "Stopping existing process on port 3001..."
        if kill_port_process 3001; then
            echo -e "${GREEN}✅ Port 3001 freed${NC}"
            sleep 2
        else
            echo -e "${RED}❌ Could not free port 3001 automatically${NC}"
            echo "Please manually stop any Node.js processes and run the script again"
            exit 1
        fi
    fi
fi

# Navigate to face-api-service directory
cd face-api-service

echo "🚀 Starting Face API server..."
echo ""

# Start server and show logs
npm start

# If we get here, the server stopped
echo ""
echo -e "${YELLOW}⚠️  Face API server stopped${NC}"
