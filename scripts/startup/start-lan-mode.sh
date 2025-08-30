#!/bin/bash

# Mood Melodies - LAN Mode Startup (For Real Face API)
# This starts Expo in LAN mode where Face API can work properly

echo "🌐 Starting Mood Melodies in LAN Mode"
echo "====================================="
echo ""
echo "LAN mode allows real Face API connection between phone and computer"
echo "Make sure your phone and computer are on the same WiFi network!"
echo ""

# Check if Face API is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Face API server not running!"
    echo "Please start it first: ./start-face-api.sh"
    exit 1
fi

echo "✅ Face API server detected at http://localhost:3001"
echo ""

# Get network IP
echo "🔍 Detecting network configuration..."
NETWORK_IP=$(node -e "
const os = require('os');
const interfaces = os.networkInterfaces();
for (let name of Object.keys(interfaces)) {
  for (let iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.')) {
      console.log(iface.address);
      process.exit(0);
    }
  }
}
console.log('localhost');
" 2>/dev/null || echo "localhost")

echo "📱 Network setup:"
echo "   Computer IP: $NETWORK_IP"
echo "   Face API: http://$NETWORK_IP:3001"
echo ""

echo "🚀 Starting Expo in LAN mode..."
echo "   This allows your phone to connect to Face API"
echo ""

npx expo start --lan
