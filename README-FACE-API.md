# 🚀 Complete Face-API.js Integration Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Your React Native app already running

## 🔧 Quick Setup (Recommended)

### 1. Run the Setup Script

**Windows:**

```bash
cd mood-melodies-app
./scripts/setup-face-api.bat
```

**macOS/Linux:**

```bash
cd mood-melodies-app
chmod +x ./scripts/setup-face-api.sh
./scripts/setup-face-api.sh
```

### 2. Manual Setup (if scripts don't work)

```bash
# Create and setup the face API service
mkdir face-api-service
cd face-api-service

# Copy the provided server.js and package.json files
# Then install dependencies
npm install

# Create required directories
mkdir uploads temp models

# Download face-api.js models manually or let the server download them
npm start
```

### 3. Start the Service

```bash
cd face-api-service
npm start
```

You should see:

```
✅ Face-API models loaded successfully
🚀 Face API service running on port 3001
📋 Health check: http://localhost:3001/health
```

### 4. Test the Service

Open http://localhost:3001/health in your browser. You should see:

```json
{ "status": "OK", "message": "Face API service is running" }
```

### 5. Test with Your Mobile App

1. Make sure the face API service is running
2. Start your React Native app
3. Go to the capture screen
4. Take a photo
5. Watch the console logs for either:
   - "✅ Real face API analysis complete:" (success)
   - "API analysis failed, using mock:" (fallback)

## 🔍 How It Works

### Development Mode

- Mobile app tries to connect to `http://localhost:3001`
- If successful: Uses real face-api.js analysis
- If failed: Falls back to realistic mock analysis

### Production Mode

- Mobile app connects to your deployed service URL
- Always uses real face-api.js analysis

## 🚨 Troubleshooting

### Service Won't Start

```bash
# Check if port 3001 is already in use
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or use a different port
```

### Models Won't Download

```bash
# Download models manually
cd face-api-service/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
# ... (download all model files as shown in deployment guide)
```

### Mobile App Can't Connect

1. Ensure service is running on `http://localhost:3001`
2. Check if your device/emulator can reach localhost
3. For physical devices, use your computer's IP address instead of localhost

### Canvas/Node-Canvas Issues

```bash
# On macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# On Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# On Windows
# Use Windows Subsystem for Linux (WSL) or Docker
```

## 📊 Expected Results

### Real Analysis

- Actual facial expression detection
- Precise emotion percentages
- Confidence scores based on face visibility
- Better accuracy for mood determination

### Mock Analysis (Fallback)

- Realistic emotion distributions
- Varied scenarios (happy, sad, neutral, etc.)
- Still provides good user experience
- Consistent with the UI design

## 🌟 Next Steps

1. **Deploy to Production**: Follow the deployment guide to host your service
2. **Optimize Performance**: Add caching, image optimization
3. **Add Features**: Face landmarks, age detection, gender detection
4. **Monitor Usage**: Add analytics and error tracking

## 📞 Support

If you encounter issues:

1. Check the console logs in both the service and mobile app
2. Verify all dependencies are installed correctly
3. Test the service endpoints directly with curl or Postman
4. Check the GitHub issues for face-api.js

Happy coding! 🎉
