@echo off
REM Mood Melodies - LAN Mode Startup (For Real Face API)
REM This starts Expo in LAN mode where Face API can work properly

echo 🌐 Starting Mood Melodies in LAN Mode
echo =====================================
echo.
echo LAN mode allows real Face API connection between phone and computer
echo Make sure your phone and computer are on the same WiFi network!
echo.

REM Check if Face API is running
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Face API server not running!
    echo Please start it first: start-face-api.bat
    pause
    exit /b 1
)

echo ✅ Face API server detected at http://localhost:3001
echo.

echo 📱 Network setup:
echo    Computer should be accessible via local network IP
echo    Face API will auto-discover the correct endpoint
echo.

echo 🚀 Starting Expo in LAN mode...
echo    This allows your phone to connect to Face API
echo.

npx expo start --lan
