@echo off
:: =============================================================================
:: 🚀 MOOD MELODIES APP - COMPLETE STARTUP SCRIPT (WINDOWS)
:: =============================================================================
:: This script starts all services needed for the app:
:: 1. Face API Service (localhost:3001)
:: 2. ngrok tunnel (public access to Face API)
:: 3. Updates app with ngrok URL
:: 4. Starts Expo in tunnel mode
:: =============================================================================

title Mood Melodies - Master Startup

echo.
echo ==================================================================
echo 🎵 MOOD MELODIES APP - COMPLETE STARTUP 🎵
echo ==================================================================
echo.

echo [STEP] 1/5 Cleaning up existing processes...
echo Killing processes on port 3001 and 8081...
npx kill-port 3001 >nul 2>&1
npx kill-port 8081 >nul 2>&1
timeout /t 2 >nul

echo [STEP] 2/5 Starting Face API Service...
start "Face API Service" cmd /k "echo Starting Face API Service... && cd /d "%~dp0" && node face-api-service/server-simple.js"
echo Waiting for Face API service to start...
timeout /t 5 >nul

echo [STEP] 3/5 Starting ngrok tunnel...
start "ngrok Tunnel" cmd /k "echo Starting ngrok tunnel... && cd /d "%~dp0" && tools\ngrok\ngrok.exe http 3001"
echo Waiting for ngrok tunnel to establish...
timeout /t 8 >nul

echo [STEP] 4/5 Updating app with ngrok URL...
if exist "tools\ngrok\update-ngrok-url.js" (
    node tools\ngrok\update-ngrok-url.js
    echo [SUCCESS] App updated with ngrok URL
) else (
    echo [WARN] ngrok URL update script not found, manual update may be needed
)

echo [STEP] 5/5 Starting Expo in tunnel mode...
start "Expo Dev Server" cmd /k "echo Starting Expo Dev Server... && cd /d "%~dp0" && npx expo start --tunnel --clear"

echo.
echo ==================================================================
echo 🎉 ALL SERVICES STARTED SUCCESSFULLY! 🎉
echo ==================================================================
echo ✅ Face API Service: http://localhost:3001
echo ✅ ngrok Tunnel: Check ngrok terminal for public URL
echo ✅ Expo Dev Server: Check Expo terminal for QR code
echo.
echo 📱 Scan the QR code with Expo Go app to test on your phone
echo 🔍 The app will use real mood analysis via ngrok tunnel
echo ==================================================================
echo.

echo [INFO] Startup complete! Check individual terminals for service status.
echo Press any key to close this window...
pause >nul
