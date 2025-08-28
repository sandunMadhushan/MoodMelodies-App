# 🚀 Mood Melodies App - Startup Guide

This guide will help you start the Mood Melodies mobile app with mood analysis functionality.

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ Expo CLI (`npm install -g expo-cli`)
- ✅ Expo Go app on your phone (or Android/iOS simulator)

## 🎯 Quick Start (Recommended)

### Option 1: Automated Startup Script

1. **Navigate to project directory:**

   ```bash
   cd "E:/Other Projects/other-clones/mood-melodies-app"
   ```

2. **Run the automated startup script:**

   ```bash
   # On Windows (Git Bash/WSL)
   ./start-face-api.sh

   # On Windows (PowerShell/CMD)
   start-face-api.bat
   ```

3. **In a new terminal, start the mobile app:**
   ```bash
   npx expo start
   ```

---

## 🛠️ Manual Setup (Step by Step)

### Step 1: Start the Face API Server

**Why:** The mobile app needs the server running to analyze mood from captured photos.

1. **Open Terminal/Command Prompt**

2. **Navigate to the face-api-service directory:**

   ```bash
   cd "E:/Other Projects/other-clones/mood-melodies-app/face-api-service"
   ```

3. **Install dependencies (first time only):**

   ```bash
   npm install
   ```

4. **Start the server:**

   ```bash
   npm start
   # OR
   node server-simple.js
   ```

5. **Verify server is running:**
   - You should see output like:
     ```
     🚀 Face API service starting...
     📍 Server running on port 3001
     ✅ Ready to receive requests!
     ```
   - Test the health endpoint: Open browser to `http://localhost:3001/health`

### Step 2: Start the Mobile App

1. **Open a NEW terminal/command prompt** (keep the server running)

2. **Navigate to the main project directory:**

   ```bash
   cd "E:/Other Projects/other-clones/mood-melodies-app"
   ```

3. **Install dependencies (first time only):**

   ```bash
   npm install
   ```

4. **Start Expo development server:**

   ```bash
   npx expo start
   ```

5. **Open the app:**
   - Scan the QR code with Expo Go app on your phone
   - OR press `a` for Android emulator
   - OR press `i` for iOS simulator

---

## 📱 Testing the Mood Analysis Feature

### Step 1: Navigate to Capture

1. Open the app on your device
2. You'll see the home screen
3. Tap the **"Capture"** button (not in bottom navigation)

### Step 2: Take a Photo

1. The camera screen will open
2. Take a photo of yourself or someone else
3. The app will automatically analyze the mood

### Step 3: View Results

- The app will show the detected mood (Happy, Sad, Angry, etc.)
- Results include confidence scores for different emotions
- If the server is down, it will show a fallback result

---

## 🔧 Troubleshooting

### Server Issues

**Problem:** Server won't start

```bash
# Solution 1: Check if port 3001 is in use
netstat -an | grep 3001

# Solution 2: Kill any process using port 3001
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Solution 3: Use a different port
PORT=3002 npm start
```

**Problem:** "Cannot find module" errors

```bash
# Solution: Reinstall dependencies
cd face-api-service
rm -rf node_modules package-lock.json
npm install
```

### Mobile App Issues

**Problem:** Expo won't start

```bash
# Solution: Clear Expo cache
npx expo start -c
```

**Problem:** "Network request failed" when capturing

- ✅ Make sure the Face API server is running on port 3001
- ✅ Check your network connection
- ✅ Try restarting both server and mobile app

**Problem:** Camera not working

- ✅ Grant camera permissions to Expo Go
- ✅ Try on a physical device (camera might not work in simulator)

### Network Issues

**Problem:** Mobile app can't reach server

1. **Find your computer's IP address:**

   ```bash
   # Windows
   ipconfig | grep "IPv4"

   # Mac/Linux
   ifconfig | grep "inet "
   ```

2. **Update the API URL in your mobile app:**
   - Edit `lib/faceApiService.ts`
   - Change `localhost` to your computer's IP address
   - Example: `http://192.168.1.100:3001`

---

## 📁 File Structure Reference

```
mood-melodies-app/
├── 📄 STARTUP-GUIDE.md          # This file
├── 📄 start-face-api.sh         # Automated startup script (Linux/Mac/Git Bash)
├── 📄 start-face-api.bat        # Automated startup script (Windows)
├── 📱 app/
│   ├── capture.tsx              # Camera screen
│   ├── index.tsx               # Home screen with capture button
│   └── ...
├── 🔧 lib/
│   └── faceApiService.ts       # API client for mood analysis
└── 🖥️ face-api-service/
    ├── server-simple.js        # Main server file
    ├── package.json           # Server dependencies
    └── ...
```

---

## 🚀 Production Deployment

### For Development:

- Use the current setup with `server-simple.js`
- Run locally on your network

### For Production:

- Deploy the Face API service to cloud (Heroku, Vercel, AWS, etc.)
- Update the API URL in `lib/faceApiService.ts`
- See `deployment-guide.md` for detailed instructions

---

## 📞 Need Help?

### Check Server Status:

```bash
curl http://localhost:3001/health
```

### Check Available Endpoints:

```bash
curl http://localhost:3001/
```

### View Server Logs:

- The server terminal will show all requests and responses
- Look for 📸, ✅, and ❌ emojis to track analysis

### Test API Manually:

```bash
# Test with curl
curl -X POST http://localhost:3001/analyze-mood-base64 \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/jpeg;base64,..."}'
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **Server Terminal Shows:**

```
🚀 Face API service starting...
📍 Server running on port 3001
✅ Ready to receive requests!
```

✅ **Mobile App Shows:**

- Camera opens when you tap "Capture"
- Photo analysis completes with mood results
- No "Network request failed" errors

✅ **Health Check Returns:**

```json
{
  "status": "OK",
  "message": "Face API service is running",
  "mode": "realistic-mock"
}
```

---

## 🔄 Daily Workflow

### Every Time You Start Development:

1. **Terminal 1 - Start Server:**

   ```bash
   cd face-api-service
   npm start
   ```

2. **Terminal 2 - Start Mobile App:**

   ```bash
   npx expo start
   ```

3. **Open app on your device and test capture feature**

### When You're Done:

- Press `Ctrl+C` in both terminals to stop
- The server and mobile app will shut down

---

_Happy coding! 🎵📱_
