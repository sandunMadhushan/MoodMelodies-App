@echo off
setlocal enabledelayedexpansion

echo.
echo 📱 Expo Development Server
echo ==================================
echo.

REM Check if Face API server is running
echo 🔍 Checking Face API server status...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Face API server is running at http://localhost:3001
) else (
    echo ⚠️  Face API server not detected at http://localhost:3001
    echo Please start the Face API server first:
    echo   - Run: start-face-api.bat ^(Windows Command Prompt^)
    echo   - Run: ./start-face-api.sh ^(Git Bash^)
    echo.
    echo 💡 The app will still work - it will auto-discover the Face API endpoint
)

REM Test network connectivity
echo.
echo 🧪 Testing network connectivity...
if exist "scripts\test-network.js" (
    node scripts\test-network.js
) else (
    echo Network test script not found, skipping...
)

REM Start Expo
echo.
echo 🚀 Starting Expo development server...
echo 🎯 The app will automatically discover the correct Face API endpoint!
echo 📲 No manual IP configuration needed - works on any laptop!
echo.

REM Start Expo with clear cache and tunnel
npx expo start --clear --tunnel
