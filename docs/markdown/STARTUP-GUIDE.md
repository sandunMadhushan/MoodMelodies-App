# 🎵 Mood Melodies App - Complete Startup Guide

## Overview

This guide will help you start the Mood Melodies app with **REAL face analysis** in tunnel mode. The app captures your mood through facial recognition and plays music accordingly.

## Prerequisites

- Node.js installed
- Expo CLI installed: `npm install -g expo-cli`
- Android/iOS device with Expo Go app
- Internet connection

## 🚀 Quick Start (Recommended)

### ⚡ Ultimate Auto-Start

```bash
./start-ultimate.sh
```

This script does **everything automatically**:

- ✅ Starts Face API server if needed
- ✅ Starts ngrok tunnel if needed
- ✅ **Auto-syncs ngrok URL** in React Native code
- ✅ Starts Expo in tunnel mode
- ✅ Verifies all services are working

### 🔧 Manual URL Update (if needed)

If ngrok URL changes during development:

```bash
node update-ngrok-url.js
```

## 🔄 Step-by-Step Startup Process (Manual)dies App - Complete Startup Guide

## Overview

This guide will help you start the Mood Melodies app with **REAL face analysis** in tunnel mode. The app captures your mood through facial recognition and plays music accordingly.

## Prerequisites

- Node.js installed
- Expo CLI installed: `npm install -g expo-cli`
- Android/iOS device with Expo Go app
- Internet connection

## 🚀 Step-by-Step Startup Process

### Step 1: Start Face API Server

```bash
cd face-api-service
node server-simple.js
```

**Expected output:**

```
Face API models loading...
Face API service running on http://0.0.0.0:3001
Health endpoint: http://localhost:3001/health
```

### Step 2: Start ngrok Tunnel (New Terminal)

```bash
cd face-api-service
powershell "& './ngrok.exe' http 3001"
```

**Expected output:**

```
Forwarding https://[random-id].ngrok-free.app -> http://localhost:3001
```

**📝 Note the tunnel URL - you'll see it in the "Forwarding" line**

### Step 3: Start Expo in Tunnel Mode (New Terminal)

```bash
cd ..
npx expo start --tunnel
```

**Expected output:**

```
› Metro waiting on exp://[tunnel-url]
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Step 4: Test on Your Phone

1. **Scan QR Code**: Use Expo Go app to scan the QR code
2. **Test Real Analysis**: Go to "Capture" tab, take a photo
3. **Verify Mood Detection**: App should show actual detected mood (not always "happy")
4. **Check Music**: Music should play based on detected mood

## 🔧 Automated Startup Scripts

### Quick Tunnel Mode Start

```bash
./start-tunnel-mode.sh
```

### Individual Scripts

- `./start-face-api.sh` - Start Face API server only
- `./start-expo.sh` - Start Expo in tunnel mode only
- `./setup-ngrok.sh` - Setup ngrok if needed

## 🩺 Troubleshooting

### Face API Server Issues

**Check if running:**

```bash
curl http://localhost:3001/health
```

**Expected response:** `{"status":"OK","message":"Face API service is running"}`

### ngrok Tunnel Issues

**Check tunnel status:**

- Visit http://127.0.0.1:4040 in browser to see ngrok dashboard
- Ensure tunnel URL is accessible

### Expo Issues

**Common fixes:**

```bash
npx expo install --fix
expo r -c  # Clear cache
```

### Network Discovery Issues

The app automatically detects the best API endpoint:

1. First tries ngrok tunnel (for tunnel mode)
2. Falls back to local network IP (for LAN mode)
3. Finally uses localhost (for local testing)

## 📱 Using the App

### Capture Tab

1. **Take Photo**: Tap camera button
2. **Wait for Analysis**: Face API processes image
3. **View Results**: Mood detected + confidence score
4. **Auto Music**: Music plays based on mood

### Music Tab

- Browse songs by mood
- Manual mood selection
- Playback controls

### Favorites Tab

- Save favorite songs
- Quick access to preferred music

## 🎯 Real Mood Analysis Features

The app now uses **real face-api.js analysis** with:

- ✅ Facial landmark detection
- ✅ Expression recognition (happy, sad, angry, surprised, fearful, disgusted, neutral)
- ✅ Confidence scores
- ✅ Robust error handling
- ✅ Network resilience

## 🌐 Network Modes

### Tunnel Mode (Recommended for Mobile)

- **Use Case**: Testing on physical devices, sharing with friends
- **Benefits**: Works from anywhere, no network configuration
- **Requirements**: Internet connection, ngrok tunnel

### LAN Mode

- **Use Case**: Local network testing
- **Benefits**: Faster, no additional dependencies
- **Requirements**: Same WiFi network

## 📋 Current Status

**Last Known Configuration:**

- Face API Server: http://localhost:3001
- ngrok Tunnel: https://07d00e81ba00.ngrok-free.app (current session)
- Expo Mode: Tunnel mode ready

## 🔄 Quick Restart Commands

**Full restart (all services):**

```bash
# Terminal 1
cd face-api-service && node server-simple.js

# Terminal 2
cd face-api-service && powershell "& './ngrok.exe' http 3001"

# Terminal 3
cd .. && npx expo start --tunnel
```

**Just restart Expo:**

```bash
npx expo start --tunnel
```

## 📞 Support

If you encounter issues:

1. Check each service is running (Face API, ngrok, Expo)
2. Verify network connectivity
3. Check firewall/antivirus settings
4. Review console logs for error messages

**Happy mood tracking! 🎵😊**
