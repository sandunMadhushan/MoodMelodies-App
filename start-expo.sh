#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Expo Development Server${NC}"
echo "=================================="
echo ""

# Check if Face API server is running
echo "🔍 Checking Face API server status..."
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Face API server is running at http://localhost:3001${NC}"
else
    echo -e "${YELLOW}⚠️  Face API server not detected at http://localhost:3001${NC}"
    echo "Please start the Face API server first:"
    echo "  - Run: ./start-face-api.sh (Linux/Mac/Git Bash)"
    echo "  - Run: start-face-api.bat (Windows Command Prompt)"
    echo ""
    echo -e "${BLUE}💡 The app will still work - it will auto-discover the Face API endpoint${NC}"
fi

# Test network connectivity
echo ""
echo "🧪 Testing network connectivity..."
if [ -f "scripts/test-network.js" ]; then
    node scripts/test-network.js
else
    echo "Network test script not found, skipping..."
fi

# Start Expo
echo ""
echo "🚀 Starting Expo development server..."
echo -e "${BLUE}🎯 The app will automatically discover the correct Face API endpoint!${NC}"
echo -e "${BLUE}📲 No manual IP configuration needed - works on any laptop!${NC}"
echo ""

# Start Expo with clear cache and tunnel
npx expo start --clear --tunnel
