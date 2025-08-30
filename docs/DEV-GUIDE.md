# 🎵 Mood Melodies App - Development Guide

## 📁 Project Structure

```
mood-melodies-app/
├── 📱 app/                     # React Native app source
├── 🎨 assets/                  # Images, icons, etc.
├── 🧩 components/              # Reusable UI components
├── 🔧 context/                 # React contexts (Auth, etc.)
├── 📚 docs/                    # Documentation
│   ├── markdown/               # All .md files
│   └── API-DOCS.md            # This file
├── 🤖 face-api-service/        # Face analysis backend
├── 🪝 hooks/                   # Custom React hooks
├── 📡 lib/                     # Utilities and services
├── 📋 scripts/                 # Development scripts
│   ├── startup/               # Old startup scripts
│   ├── cleanup-port.sh        # Port cleanup utility
│   ├── find-ip.js            # Network discovery
│   └── test-network.js       # Network testing
└── 🛠️ tools/                   # Development tools
    └── ngrok/                 # ngrok tunnel tools
        ├── ngrok.exe          # ngrok executable
        └── update-ngrok-url.js # Auto URL updater
```

## 🚀 Quick Start

### One-Command Startup

```bash
# For Windows
./start-all.bat

# For Linux/Mac
./start-all.sh
```

This will start:

1. 🤖 Face API Service (port 3001)
2. 🌐 ngrok tunnel (public access)
3. 📱 Expo development server (tunnel mode)
4. 🔄 Auto-update app with ngrok URL

### Manual Startup (if needed)

1. **Start Face API Service:**

   ```bash
   node face-api-service/server-simple.js
   ```

2. **Start ngrok tunnel:**

   ```bash
   ./tools/ngrok/ngrok.exe http 3001
   ```

3. **Update app with ngrok URL:**

   ```bash
   node tools/ngrok/update-ngrok-url.js
   ```

4. **Start Expo:**
   ```bash
   npx expo start --tunnel --clear
   ```

## 🔧 Development Tools

### Port Management

```bash
# Kill processes on specific ports
npx kill-port 3001    # Face API
npx kill-port 8081    # Expo
```

### Network Testing

```bash
# Test network connectivity
node scripts/test-network.js

# Find local IP
node scripts/find-ip.js
```

### Service Health Checks

```bash
# Check Face API health
curl http://localhost:3001/health

# Check ngrok tunnel
curl -H "ngrok-skip-browser-warning: any" YOUR_NGROK_URL/health
```

## 📱 Mobile Testing

1. Install **Expo Go** on your phone
2. Run `./start-all.bat` or `./start-all.sh`
3. Scan the QR code from Expo terminal
4. Test mood analysis with camera capture

## 🐛 Troubleshooting

### Face API Issues

- Check if port 3001 is free: `npx kill-port 3001`
- Verify service health: `curl http://localhost:3001/health`
- Check face-api-service logs in terminal

### ngrok Issues

- Ensure authtoken is configured: `./tools/ngrok/ngrok.exe authtoken YOUR_TOKEN`
- Check tunnel status in ngrok terminal
- Verify tunnel URL is updated in app

### Expo Issues

- Clear cache: `npx expo start --clear`
- Reset Metro bundler: `npx expo start --reset-cache`
- Check tunnel mode connectivity

### Network Issues

- Test local network: `node scripts/test-network.js`
- Check firewall settings
- Verify phone and computer are on same network (for LAN mode)

## 🏗️ Architecture

### Real Mood Analysis Flow

1. 📸 User captures image in React Native app
2. 📤 App sends image to ngrok tunnel URL
3. 🌐 ngrok forwards request to local Face API service
4. 🤖 Face API analyzes image using face-api.js
5. 📊 Returns mood data (happy, sad, angry, etc.)
6. 📱 App displays mood result and generates music

### Fallback System

- If ngrok/Face API fails → Uses mock analysis
- Graceful degradation ensures app always works
- Enhanced error logging for debugging

## 📝 Configuration Files

- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `face-api-service/package.json` - Face API dependencies
- `.gitignore` - Git ignore patterns

## 🎯 Key Features

- 📸 **Camera Integration** - Capture selfies for mood analysis
- 🤖 **Real AI Analysis** - Uses face-api.js for actual mood detection
- 🎵 **Music Generation** - AI-powered music based on detected mood
- 🌐 **Tunnel Mode** - Works on any network via ngrok
- 🔒 **Authentication** - Supabase auth integration
- ⭐ **Favorites** - Save and replay favorite music
- 👤 **Profile** - User management and preferences

---

📚 For more detailed documentation, check the `docs/markdown/` folder.
