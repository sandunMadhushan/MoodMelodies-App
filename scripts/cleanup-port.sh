#!/bin/bash

# 🔧 Port 3001 Cleanup Script
# Use this if the automated script fails to free the port

echo "🔧 Cleaning up port 3001..."

# Method 1: Kill all Node.js processes
echo "Stopping all Node.js processes..."
taskkill //F //IM node.exe //T 2>/dev/null && echo "✅ Node.js processes stopped" || echo "ℹ️  No Node.js processes found"

# Method 2: Try PowerShell method
if command -v powershell.exe >/dev/null 2>&1; then
    echo "Using PowerShell to free port 3001..."
    powershell.exe -Command "
        Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host 'Cleaned up Node.js processes'
    " 2>/dev/null
fi

# Wait a moment
sleep 2

# Test if port is free
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "⚠️  Port 3001 is still occupied"
    echo "You may need to restart your computer or manually find and kill the process"
else
    echo "✅ Port 3001 is now free!"
    echo "You can now run ./start-auto.sh again"
fi

echo ""
echo "💡 If this doesn't work, try:"
echo "1. Close all terminals and IDEs"
echo "2. Restart your computer"
echo "3. Run ./start-auto.sh again"
