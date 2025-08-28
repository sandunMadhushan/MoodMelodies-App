@echo off
echo 🚀 Setting up Face API Service...

REM Create service directory
if not exist "face-api-service" mkdir face-api-service
cd face-api-service

REM Install dependencies
echo 📦 Installing dependencies...
call npm install express cors multer face-api.js canvas @tensorflow/tfjs @tensorflow/tfjs-node
call npm install -D nodemon

REM Create directories
if not exist "uploads" mkdir uploads
if not exist "temp" mkdir temp
if not exist "models" mkdir models

echo ✅ Face API Service setup complete!
echo 🚀 To start the service:
echo    cd face-api-service
echo    npm start

pause
