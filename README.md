# 🎵 Mood Melodies App

**AI-Powered Music Recommendation App Based on Facial Emotion Analysis**

A React Native mobile application that captures your photo, analyzes your mood using AI facial recognition, and provides personalized music playlists from locally stored songs organized by mood.

![Mood Melodies App](./assets/images/Logo%20Trans.png)

## 📱 Features

### 🎯 Core Functionality

- **📸 Photo Capture**: Take photos using device camera
- **🤖 AI Mood Analysis**: Real-time facial emotion detection using face-api.js
- **🎵 Local Music Library**: Curated local playlists based on detected emotions
- **🎧 Integrated Music Player**: Play, pause, skip, and control music playback
- **💾 Mood History**: Track your emotional journey over time
- **🔐 User Authentication**: Secure login/signup with Supabase

### 🎭 Supported Emotions

- **😊 Happy** - Upbeat, energetic local tracks
- **😢 Sad** - Melancholic, emotional local ballads
- **😠 Angry** - Rock, intense local music
- **😌 Calm** - Peaceful, relaxing local sounds
- **😰 Anxious** - Soothing, calming local melodies
- **😲 Surprised** - Discovery mix from local collection
- **🤢 Disgusted** - Alternative, raw local music

### 🎼 Music System

- **🎯 Local Storage**: Songs organized by mood in assets/audio/
- **� Mood Folders**: Dedicated folders for each emotion type
- **🎚️ Quality**: High-quality local audio files with metadata

## 🛠️ Tech Stack

### 📱 Frontend

- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **Expo Router** for navigation
- **NativeWind** for styling
- **Expo Camera** for photo capture
- **Expo AV** for audio playback

### 🧠 AI & Backend

- **face-api.js** for facial emotion recognition
- **Node.js/Express** API server for mood analysis
- **Supabase** for authentication and data storage
- **ngrok** for tunnel access to local API

### 🎵 Audio Integration

- **Local Music Library** organized by mood categories
- **Cross-platform audio playback** via Expo AV
- **Emotion-based playlist curation** from local assets

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **Expo Go** app on your mobile device

### 1. Clone & Install

```bash
git clone https://github.com/sandunMadhushan/mood-melodies-app.git
cd mood-melodies-app
npm install
cd face-api-service
npm install
cd ..
```

### 2. Environment Setup

#### Supabase Configuration

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Update `lib/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

#### ngrok Setup (for real mood analysis)

1. Create account at [ngrok.com](https://ngrok.com)
2. Get your authtoken from dashboard
3. Configure ngrok:

```bash
./tools/ngrok/ngrok.exe authtoken YOUR_AUTHTOKEN
```

#### Local Music Setup

1. Add your music files to the appropriate mood folders:

   - `assets/audio/happy/` - Upbeat, energetic songs
   - `assets/audio/sad/` - Melancholic, emotional songs
   - `assets/audio/angry/` - Rock, intense songs
   - `assets/audio/calm/` - Peaceful, relaxing songs
   - `assets/audio/anxious/` - Soothing, calming songs
   - `assets/audio/surprised/` - Discovery mix songs
   - `assets/audio/disgusted/` - Alternative, raw songs

2. Supported formats: MP3, M4A, WAV
3. The app will automatically load songs from these folders based on detected mood

### 3. One-Command Startup 🚀

**This is the easiest way to start everything:**

```bash
# Windows
./start-all.bat

# Linux/Mac
./start-all.sh
```

This automatically starts:

1. 🤖 Face API Service (localhost:3001)
2. 🌐 ngrok tunnel (public access)
3. 📱 Expo development server (tunnel mode)
4. 🔄 Auto-updates app with ngrok URL

### 4. Manual Startup (Alternative)

If you prefer to start services individually:

```bash
# Terminal 1: Start Face API Service
node face-api-service/server-simple.js

# Terminal 2: Start ngrok tunnel
./tools/ngrok/ngrok.exe http 3001

# Terminal 3: Update app with ngrok URL
node tools/ngrok/update-ngrok-url.js

# Terminal 4: Start Expo
npx expo start --tunnel --clear
```

## 📱 Installation & Usage

### Development Testing

1. **Install Expo Go** on your mobile device
2. **Run startup script**: `./start-all.bat` or `./start-all.sh`
3. **Scan QR code** from Expo terminal
4. **Allow camera permissions** when prompted
5. **Test mood analysis** by taking a selfie

### Production Build

```bash
# Android APK
npx expo build:android

# iOS IPA
npx expo build:ios
```

## 🎯 App Flow

### 1. Authentication

- **Sign up** with email/password
- **Login** to existing account
- **Secure session** management with Supabase

### 2. Mood Capture

- **📸 Take Photo**: Capture using device camera
- **🤖 AI Analysis**: Real-time mood detection via ngrok tunnel
- **📊 Results**: View detected emotion with confidence score

### 3. Music Discovery

- **🎵 Smart Playlists**: Auto-generated based on detected mood
- **🎯 Local Music Library**: Curated songs organized by emotion
- **🔄 Mood-based Selection**: Automatic playlist curation

### 4. Music Experience

- **🎧 Integrated Player**: Play/pause, seek, skip
- **📱 Intuitive Controls**: Seamless mobile experience
- **💾 History**: Track your mood and music journey

## 🏗️ Architecture

### Project Structure

```
mood-melodies-app/
├── 🚀 start-all.sh             # One-command startup (Linux/Mac)
├── 🚀 start-all.bat            # One-command startup (Windows)
├── 📖 README.md                # This file
├── 📱 app/                     # App screens (Expo Router)
│   ├── (auth)/                # Authentication screens
│   │   ├── login.tsx          # Login screen
│   │   └── signup.tsx         # Signup screen
│   ├── (tabs)/                # Main app tabs
│   │   ├── index.tsx          # Home/Dashboard
│   │   ├── capture.tsx        # Photo capture
│   │   ├── music.tsx          # Music player
│   │   ├── favorites.tsx      # Saved favorites
│   │   └── profile.tsx        # User profile
│   ├── analyzing.tsx          # Mood analysis screen
│   ├── mood-result.tsx        # Analysis results
│   └── player.tsx             # Music player screen
├── 📡 lib/                     # Core services
│   ├── supabase.ts            # Database client
│   ├── musicService.ts        # Music API integration
│   ├── faceApiService.ts      # Mood analysis client
│   └── dynamicNetworkDiscovery.ts # Network discovery
├── 🧩 components/              # Reusable UI components
├── 🔧 context/                 # React context providers
│   └── AuthContext.tsx        # Authentication context
├── 🤖 face-api-service/        # Node.js API server
│   ├── server-simple.js       # Express server
│   ├── get-ngrok-url.js       # ngrok URL fetcher
│   └── package.json           # API dependencies
├── 📚 docs/                    # Documentation
│   ├── DEV-GUIDE.md           # Development guide
│   └── markdown/              # All documentation files
├── 📋 scripts/                 # Development utilities
│   ├── startup/               # Startup scripts
│   ├── cleanup-port.sh        # Port management
│   ├── find-ip.js            # Network discovery
│   └── test-network.js       # Network testing
├── 🛠️ tools/                   # Development tools
│   └── ngrok/                 # ngrok tunnel tools
│       ├── ngrok.exe          # ngrok executable
│       └── update-ngrok-url.js # Auto URL updater
└── 🎨 assets/                  # Images and static files
```

### Key Services

#### Face API Service (`face-api-service/`)

- **Express server** for mood analysis
- **face-api.js integration** for emotion detection
- **Image processing** and confidence scoring
- **RESTful API** endpoints
- **Realistic mock analysis** for development

#### Dynamic Network Discovery (`lib/dynamicNetworkDiscovery.ts`)

- **Automatic ngrok URL detection**
- **Fallback to localhost** for development
- **Tunnel mode optimization**
- **Enhanced error handling**

#### Music Service (`lib/musicService.ts`)

- **Local music library** with mood-based organization
- **Cross-platform audio** playback via Expo AV
- **Automatic playlist curation** based on detected emotions
- **Error handling** and fallback audio files

## 🔧 Configuration

### Music Service Configuration

The app uses a local music system with mood-based organization:

1. **Local Storage**: Songs organized in assets/audio/ by mood
2. **Mood Mapping**: Automatic playlist selection based on emotions
3. **Fallback System**: Demo audio files for guaranteed playback

### API Endpoints

- **Mood Analysis**: `http://localhost:3001/analyze-mood`
- **Health Check**: `http://localhost:3001/health`
- **ngrok Tunnel**: Dynamic URL via tunnel discovery

### ngrok Configuration

The app automatically detects and uses ngrok tunnel URLs for mobile access:

- **Automatic discovery** of ngrok public URL
- **Header injection** for ngrok compatibility
- **Fallback handling** when tunnel is unavailable

## 🐛 Troubleshooting

### Common Issues

#### 1. Face API Service Issues

```bash
# Check if service is running
curl http://localhost:3001/health

# Kill port conflicts
npx kill-port 3001

# Start service manually
node face-api-service/server-simple.js
```

#### 2. ngrok Tunnel Issues

```bash
# Configure authtoken
./tools/ngrok/ngrok.exe authtoken YOUR_TOKEN

# Start tunnel manually
./tools/ngrok/ngrok.exe http 3001

# Update app with new URL
node tools/ngrok/update-ngrok-url.js
```

#### 3. Camera Permissions

```bash
# Add to app.json
"permissions": ["CAMERA", "CAMERA_ROLL"]
```

#### 4. Audio Playback Issues

- Ensure **Expo AV** is properly installed
- Check **audio URLs** are accessible
- Verify **device audio settings**

#### 5. Network Connectivity

```bash
# Test network connectivity
node scripts/test-network.js

# Find local IP
node scripts/find-ip.js
```

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// Enhanced logging in faceApiService.ts
console.log('🔍 Network discovery result:', result);
console.log('📡 Using endpoint:', endpoint);
```

### Service Health Checks

```bash
# Check Face API health
curl http://localhost:3001/health

# Check ngrok tunnel (replace with your URL)
curl -H "ngrok-skip-browser-warning: any" https://your-ngrok-url.ngrok-free.app/health

# Test mood analysis
curl -X POST -H "Content-Type: application/json" \
  -d '{"image":"base64_image_data"}' \
  http://localhost:3001/analyze-mood
```

## 📚 Documentation

### Additional Guides

- **[Development Guide](./docs/DEV-GUIDE.md)** - Complete development setup
- **[Face API Setup](./docs/face-api-setup.md)** - Face recognition configuration
- **[Testing Guide](./docs/markdown/TESTING-GUIDE.md)** - QA and testing procedures
- **[Startup Guide](./docs/markdown/STARTUP-GUIDE.md)** - Detailed setup instructions
- **[Tunnel Mode Guide](./docs/markdown/TUNNEL-MODE.md)** - ngrok tunnel configuration

### API Reference

- **Mood Analysis**: POST `/analyze-mood` with image data
- **Health Check**: GET `/health` for service status
- **Local Music**: Organized mood-based playlist system
- **User Auth**: Supabase authentication flow

## 🚀 Deployment

### Mobile App Stores

```bash
# Build for production
npx expo build:android
npx expo build:ios

# Submit to stores
npx expo submit:android
npx expo submit:ios
```

### API Server Deployment

Deploy the face-api-service to cloud platforms:

- **Heroku**: `git push heroku main`
- **Vercel**: `vercel deploy`
- **Railway**: Connect GitHub repository

Update the app configuration to use production API endpoint.

## 🎯 Development Workflow

### Starting Development

1. **Quick Start**: `./start-all.bat` (Windows) or `./start-all.sh` (Linux/Mac)
2. **Mobile Testing**: Scan QR code with Expo Go
3. **Real Analysis**: Test mood detection with camera
4. **Music Playback**: Verify music generation and playback

### Development Tools

```bash
# Port management
npx kill-port 3001    # Face API
npx kill-port 8081    # Expo

# Network testing
node scripts/test-network.js
node scripts/find-ip.js

# Service testing
curl http://localhost:3001/health
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Expo** best practices

## 🤝 Contributing

### Development Setup

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow setup instructions** above
4. **Test changes** with `./start-all.bat`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **Expo** and **React Native** best practices
- Add **proper error handling** and logging
- Include **tests** for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **face-api.js** for facial emotion recognition
- **Local Music Community** for curated audio collections
- **Supabase** for backend services
- **ngrok** for tunnel access
- **Expo** for cross-platform development
- **React Native** community for excellent tools

## 📞 Support

### Get Help

- **🐛 Issues**: [GitHub Issues](https://github.com/sandunMadhushan/mood-melodies-app/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/sandunMadhushan/mood-melodies-app/discussions)
- **📚 Documentation**: [Development Guide](./docs/DEV-GUIDE.md)

### Quick Support Commands

```bash
# Health check all services
curl http://localhost:3001/health

# Restart everything
./start-all.bat  # or ./start-all.sh

# Clear Expo cache
npx expo start --clear

# Test network connectivity
node scripts/test-network.js
```

### Version

**Current Version**: 1.0.0  
**Last Updated**: August 30, 2025  
**Node.js**: 18+  
**Expo SDK**: 53  
**React Native**: Latest

---

_Transform your emotions into musical experiences_ 🎵✨

**🚀 Ready to start? Run `./start-all.bat` and scan the QR code!**
