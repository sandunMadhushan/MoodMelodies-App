@echo off
REM Mood Melodies - Tunnel Mode Startup Script for Windows
REM Starts both Face API server and Expo app in tunnel mode for easy mobile access

setlocal enabledelayedexpansion

echo 🚀 Starting Mood Melodies in Tunnel Mode
echo ===========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the mood-melodies-app root directory
    exit /b 1
)

if not exist "face-api-service" (
    echo ❌ Error: face-api-service directory not found
    exit /b 1
)

echo 📋 Tunnel Mode Setup for Mobile Access
echo This will start both Face API server and Expo app in tunnel mode
echo Perfect for testing on your actual phone!
echo.

echo 🔧 Step 1: Starting Face API Server
echo   The Face API server will run on your computer's IP address
echo   This allows your phone to connect to it via tunnel mode
echo.

REM Start Face API server in new window
start "Face API Server" cmd /c "cd face-api-service && npm start"

echo ✅ Face API server started in new window
echo   Check the Face API Server window for logs

REM Give server time to start
timeout /t 3 /nobreak > nul

echo.
echo 🔧 Step 2: Starting Expo in Tunnel Mode
echo   Expo tunnel mode allows your phone to connect from anywhere
echo   Scan the QR code with Expo Go app on your phone
echo.

REM Start Expo in tunnel mode in new window
start "Expo Tunnel" cmd /c "npx expo start --tunnel"

echo ✅ Expo starting in tunnel mode in new window
echo   Check the Expo Tunnel window for QR code and logs

echo.
echo 📱 Mobile Setup Instructions
echo ============================================
echo 1. Install Expo Go app on your phone:
echo    📱 iOS: Search 'Expo Go' in App Store
echo    🤖 Android: Search 'Expo Go' in Play Store
echo.
echo 2. Check the Expo Tunnel window for the QR code
echo    📊 Look for the QR code in the new terminal window
echo.
echo 3. Scan the QR code with Expo Go app
echo    📷 Use the camera or QR scanner in Expo Go
echo.
echo 4. The app will load on your phone via tunnel mode
echo    🌐 Face API will automatically work through tunnel
echo.
echo 💡 Tips:
echo    • Keep both terminal windows open while testing
echo    • Face API runs on your computer's network IP
echo    • Expo tunnel works from anywhere with internet
echo    • Close terminal windows to stop services
echo.

echo 🎯 Services Status:
echo    Face API Server: Running (in separate window)
echo    Expo Tunnel:     Running (in separate window)
echo.
echo 📋 Next Steps:
echo 1. Check the Expo Tunnel window for the QR code
echo 2. Scan QR code with Expo Go app
echo 3. Test mood analysis with your phone's camera
echo.

echo ✅ Setup complete! Both services are running in separate windows.
echo    Close this window when you're done testing.
echo.
pause
