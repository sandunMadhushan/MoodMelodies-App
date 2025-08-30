# 🌐 Tunnel vs LAN Mode Guide

This guide explains the difference between **tunnel mode** and **LAN mode** for Mood Melodies, and when to use each.

## ⚡ Quick Decision Guide

**Want REAL face analysis?** → Use **LAN Mode**

```bash
./start-lan-mode.sh    # Mac/Linux
start-lan-mode.bat     # Windows
```

**Want easy sharing/demo?** → Use **Tunnel Mode**

```bash
./start-tunnel-mode.sh    # Mac/Linux (mock analysis)
start-tunnel-mode.bat     # Windows (mock analysis)
```

## 🔍 Key Differences

### 🏠 LAN Mode (Recommended for Development)

- ✅ **Real face analysis** with face-api.js
- ✅ **Full app functionality**
- ⚠️ Phone and computer must be on **same WiFi**
- ⚠️ Requires **network setup**

### 🌐 Tunnel Mode (Good for Demos)

- ✅ **Works from anywhere** with internet
- ✅ **Easy to share** with QR code
- ⚠️ **Mock face analysis only** (realistic but not real)
- ⚠️ Face API can't reach tunnel endpoints

## 🚀 LAN Mode Setup (Real Face Analysis)

## 🚀 LAN Mode Setup (Real Face Analysis)

### Step 1: Start Face API Server

```bash
./start-face-api.sh    # This is already running in your case!
```

### Step 2: Start Expo in LAN Mode

```bash
./start-lan-mode.sh    # Mac/Linux
start-lan-mode.bat     # Windows
```

### Step 3: Connect Phone

- Make sure phone and computer are on **same WiFi**
- Scan QR code with Expo Go
- **Real face analysis will work!**

## 🌐 Tunnel Mode Setup (Mock Analysis Only)

## 🌐 Tunnel Mode Setup (Mock Analysis Only)

⚠️ **Note: Tunnel mode uses realistic mock analysis, not real face detection**

### Windows Users

```bash
start-tunnel-mode.bat    # Mock analysis only
```

### Mac/Linux Users

```bash
./start-tunnel-mode.sh   # Mock analysis only
```

## 💡 Why This Limitation?

When using **tunnel mode**:

- Your phone connects via internet tunnel (e.g., exp://xyz.exp.direct)
- Face API server runs on local network (e.g., 192.168.1.100:3001)
- Phone **cannot reach** local network IPs through tunnel
- App automatically falls back to **realistic mock analysis**

When using **LAN mode**:

- Your phone connects directly to local network
- Face API server accessible on same network
- **Real face analysis works perfectly!**

## 🔄 Current Status Fix

Since you're currently in **tunnel mode** but want **real face analysis**:

1. **Stop current tunnel mode** (Ctrl+C in the Expo terminal)
2. **Start LAN mode instead**:
   ```bash
   ./start-lan-mode.sh    # Mac/Linux
   start-lan-mode.bat     # Windows
   ```
3. **Scan new QR code** with Expo Go
4. **Test face analysis** - it will now use real detection!

## 📱 Mobile Setup

1. **Install Expo Go** on your phone:

   - 📱 iOS: Search "Expo Go" in App Store
   - 🤖 Android: Search "Expo Go" in Play Store

2. **Start tunnel mode** (using scripts above)

3. **Scan QR code** in the Expo terminal window with Expo Go app

4. **Test the app** - mood analysis will work automatically!

## 🔧 Manual Setup (if scripts don't work)

### Step 1: Start Face API Server

```bash
cd face-api-service
npm start
```

### Step 2: Start Expo in Tunnel Mode

```bash
npx expo start --tunnel
```

### Step 3: Connect Your Phone

- Open Expo Go app
- Scan the QR code from the terminal
- Wait for app to load

## 🌐 How Tunnel Mode Works

### Traditional Setup (LAN Mode)

- Phone and computer must be on same WiFi
- Uses local IP addresses (e.g., 192.168.1.100)
- Direct network connection

### Tunnel Mode

- Works from anywhere with internet
- Expo creates a secure tunnel to your computer
- Face API auto-discovers working network endpoint
- No manual IP configuration needed

## 🔍 Troubleshooting

### Face API Connection Issues

The app will automatically try to connect to the Face API server through multiple endpoints:

1. **Local endpoints** (if testing in simulator)
2. **Network endpoints** (your computer's WiFi IP)
3. **Mock fallback** (if server can't be reached)

### Common Issues & Solutions

#### "Expo tunnel not working"

```bash
# Try updating Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
npx expo r -c
```

#### "Face API not accessible"

```bash
# Make sure Face API server is running
cd face-api-service
npm start

# Check your computer's firewall settings
# Allow Node.js through Windows Firewall
```

#### "QR code not appearing"

```bash
# Try running Expo manually
npx expo start --tunnel --clear

# Check if ngrok is working
npx expo doctor
```

### Log Files

When using the automated scripts, check these log files:

- `face-api.log` - Face API server logs
- `expo.log` - Expo tunnel logs

## 🛠️ Advanced Configuration

### Custom Face API Port

If port 3001 is already in use:

1. Edit `face-api-service/server-simple.js`:

```javascript
const PORT = process.env.PORT || 3002; // Change port
```

2. Update network discovery in `lib/networkDiscovery.ts`:

```typescript
const port = '3002'; // Update port
```

### Network Discovery Priority

The app tests endpoints in this order:

1. `localhost:3001` (simulator/local testing)
2. `192.168.x.x:3001` (WiFi networks - highest priority)
3. `172.x.x.x:3001` (virtual networks)
4. `10.x.x.x:3001` (other private networks)

## 🎯 Testing Checklist

- [ ] Face API server starts without errors
- [ ] Expo tunnel generates QR code
- [ ] Phone can scan QR code with Expo Go
- [ ] App loads on phone
- [ ] Camera capture works
- [ ] Mood analysis returns results (real or mock)
- [ ] Playlist selection works
- [ ] Music playback works

## 💡 Pro Tips

1. **Keep terminals open** while testing - closing them stops the services
2. **Check firewall** - Windows may ask to allow Node.js network access
3. **Use WiFi** - Mobile data may have restrictions
4. **Update Expo Go** - Make sure you have the latest version
5. **Clear cache** - Use `npx expo r -c` if you see old cached content

## 🔗 Useful Commands

```bash
# Start everything
./start-tunnel-mode.sh         # Mac/Linux
start-tunnel-mode.bat          # Windows

# Manual commands
cd face-api-service && npm start    # Start Face API
npx expo start --tunnel             # Start Expo tunnel
npx expo start --lan               # Start Expo LAN mode
npx expo r -c                      # Clear cache and restart

# Debugging
tail -f face-api.log               # Watch Face API logs
tail -f expo.log                   # Watch Expo logs
npx expo doctor                    # Check Expo setup
```

## 🆘 Need Help?

If you're still having issues:

1. **Check the main README.md** for general setup
2. **Try LAN mode first** with `npx expo start --lan`
3. **Verify Face API** works by visiting `http://localhost:3001/health`
4. **Check network connectivity** between phone and computer

The app is designed to work automatically - if the Face API server can't be reached, it will use realistic mock analysis so you can still test the full app experience!
