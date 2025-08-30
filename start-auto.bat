@echo off
setlocal enabledelayedexpansion

REM 🚀 Automated Startup Script for Mood Melodies App (Windows)
REM Works on any laptop - automatically discovers network configuration

echo 🎵 Starting Mood Melodies App with Auto-Discovery...
echo 🌐 This script works on ANY laptop without manual IP configuration!
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Display network information
echo.
echo 🌐 Network Discovery Results:
echo 📍 Your computer will be accessible from these IPs:

REM Get IP addresses
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo    • http://%%b:3001
    )
)
echo    • http://localhost:3001 (local access)
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing main app dependencies...
    npm install
)

if not exist "face-api-service\node_modules" (
    echo 📦 Installing Face API service dependencies...
    cd face-api-service
    npm install
    cd ..
)

REM Check if port 3001 is in use
netstat -an | findstr ":3001" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 3001 is already in use. Face API server might already be running.
    echo Testing existing server...
    
    curl -s http://localhost:3001/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Face API server is already running and responding
    ) else (
        echo ❌ Port 3001 is occupied but server is not responding
        echo Please stop the process using port 3001 and try again
        pause
        exit /b 1
    )
) else (
    echo 🧠 Starting Face API Server...
    echo Starting Face API service in background...
    
    REM Start server in background
    cd face-api-service
    start /b npm start > ..\face-api.log 2>&1
    cd ..
    
    REM Wait for server to start
    echo Waiting for Face API server to start...
    set /a counter=0
    :wait_loop
    set /a counter+=1
    
    curl -s http://localhost:3001/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Face API server started successfully
        goto server_ready
    )
    
    if !counter! geq 10 (
        echo ❌ Face API server failed to start after 10 seconds
        echo Check face-api.log for error details
        goto cleanup
    )
    
    echo Waiting... (!counter!/10)
    timeout /t 1 /nobreak >nul
    goto wait_loop
    
    :server_ready
)

REM Test network connectivity
echo.
echo 🧪 Testing network connectivity...
node scripts\test-network.js

REM Start mobile app
echo.
echo 📱 Starting Expo development server...
echo 🎯 The app will automatically discover the correct Face API endpoint!
echo 📲 No manual IP configuration needed - works on any laptop!
echo.

REM Start Expo
npx expo start --clear --tunnel

:cleanup
echo.
echo 🛑 Script finished
pause
