@echo off
setlocal enabledelayedexpansion

echo.
echo 🤖 Face API Server Startup
echo ==================================
echo.

REM Check if face-api-service directory exists
if not exist "face-api-service" (
    echo ❌ face-api-service directory not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Function to check if port is in use
echo Checking if port 3001 is available...
netstat -an | findstr ":3001" >nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  Port 3001 is already in use
    
    REM Check if it's our Face API server
    curl -s http://localhost:3001/health >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Face API server is already running!
        echo Face API server is ready at http://localhost:3001
        echo.
        echo 📋 Press Ctrl+C to stop monitoring
        echo.
        
        REM Monitor the existing server
        :monitor_loop
        curl -s http://localhost:3001/health >nul 2>&1
        if %errorlevel% == 0 (
            timeout /t 5 /nobreak >nul
            goto monitor_loop
        )
        echo ❌ Face API server stopped
        pause
        exit /b 0
    ) else (
        echo Stopping existing process on port 3001...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
            taskkill /pid %%a /f >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        echo ✅ Port 3001 freed
    )
)

REM Navigate to face-api-service directory
cd face-api-service

echo 🚀 Starting Face API server...
echo.

REM Start server and show logs
npm start

REM If we get here, the server stopped
echo.
echo ⚠️  Face API server stopped
pause
