# 🎯 Quick Setup - Mood Melodies App

**One-Click Setup - Works on ANY Laptop!** 🚀

## 📋 Prerequisites (One-Time Setup)

1. **Install Node.js** (if not already installed):

   - Download from: https://nodejs.org/
   - Choose "LTS" version
   - Install with default settings

2. **Install Expo Go** on your phone:
   - **Android**: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

## 🚀 Automatic Setup & Run

### Windows Command Prompt (CMD) or PowerShell:

```cmd
# 1. Download/clone the project
# 2. Open Command Prompt or PowerShell in project folder
# 3. Run the automated script:
start-auto.bat
```

### Git Bash (Windows) / Mac / Linux:

```bash
# 1. Download/clone the project
# 2. Open Git Bash or terminal in project folder
# 3. Make script executable and run:
chmod +x start-auto.sh
./start-auto.sh
```

### ⚠️ Important for Git Bash Users:

If you're using Git Bash on Windows, **DON'T** use `.bat` files. Use the `.sh` script instead:

```bash
# Run this in Git Bash:
./start-auto.sh
```

### 📋 Quick Reference Table:

| Terminal Type          | Command           |
| ---------------------- | ----------------- |
| Windows CMD/PowerShell | `start-auto.bat`  |
| Git Bash (Windows)     | `./start-auto.sh` |
| Mac Terminal           | `./start-auto.sh` |
| Linux Terminal         | `./start-auto.sh` |

### Alternative (Manual Commands):

```bash
# Install dependencies
npm install
cd face-api-service && npm install && cd ..

# Start Face API server (in one terminal)
cd face-api-service && npm start

# Start mobile app (in another terminal)
npx expo start
```

## 📱 Using the App

1. **Scan QR Code**: Use Expo Go app to scan the QR code from terminal
2. **Grant Permissions**: Allow camera access when prompted
3. **Take Photo**: Use capture feature to analyze mood
4. **Enjoy Music**: Get personalized playlists based on your emotion!

## 🎯 Key Features

✅ **Automatic Network Discovery** - No manual IP configuration!
✅ **Real Face Analysis** - Uses AI to detect emotions
✅ **Spotify Integration** - Real music with metadata
✅ **Fallback System** - Always works even if Spotify fails
✅ **Cross-Platform** - Works on any laptop/network
✅ **Automatic Port Conflict Resolution** - Fixes stuck processes automatically

## 🔧 Troubleshooting

### Common Terminal Issues:

#### "command not found" error:

- **Git Bash users**: Use `./start-auto.sh` (NOT `start-auto.bat`)
- **Windows CMD/PowerShell users**: Use `start-auto.bat`
- **Mac/Linux users**: Use `./start-auto.sh`

#### "Permission denied" error:

```bash
# Make the script executable first:
chmod +x start-auto.sh
./start-auto.sh
```

#### Port 3001 conflict:

The script now **automatically detects and fixes** port conflicts! If you still have issues:

```bash
# Use the manual cleanup script:
./cleanup-port.sh
# Then try again:
./start-auto.sh
```

### If Face Analysis Shows "Using Mock":

1. ✅ Make sure Face API server is running (`cd face-api-service && npm start`)
2. ✅ Check if port 3001 is accessible (`curl http://localhost:3001/health`)
3. ✅ Restart the mobile app to trigger network rediscovery

### If Music Doesn't Play:

1. ✅ Check internet connection
2. ✅ Try different tracks in the playlist
3. ✅ Fallback audio will always work even if Spotify fails

### If App Won't Start:

1. ✅ Update Node.js to latest LTS version
2. ✅ Clear cache: `npx expo start --clear`
3. ✅ Reinstall dependencies: `rm -rf node_modules && npm install`

## 🌐 Network Information

The app automatically discovers your computer's network IP addresses and tests connectivity. You'll see output like:

```
📡 Current IP Addresses: 192.168.1.100, 172.31.98.229
🧪 Testing connectivity to Face API server...

Testing: http://localhost:3001
✅ SUCCESS - Status: 200

Testing: http://192.168.1.100:3001
✅ SUCCESS - Status: 200
```

**No manual configuration needed!** 🎉

## 💡 Tech Magic Behind the Scenes

- **Dynamic IP Discovery**: Automatically finds working network endpoints
- **Smart Fallback**: Tests multiple IPs until one works
- **Caching**: Remembers working endpoints for 5 minutes
- **Auto-Retry**: Clears cache and rediscovers if connection fails

## 📞 Need Help?

1. **Check Logs**: Look for `✅ REAL FACE API SUCCESS` or `❌ API analysis failed`
2. **Network Test**: Run `node scripts/test-network.js` to diagnose connectivity
3. **Reset Cache**: Restart app to force network rediscovery

---

**Made with ❤️ for easy sharing with friends!** 🎵

_Just run the script and start capturing moods - everything else is automatic!_
