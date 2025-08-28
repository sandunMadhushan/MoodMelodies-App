# 🎵 Mood Melodies App

**AI-Powered Music Recommendation App Based on Facial Emotion Analysis**

A React Native mobile application that captures your photo, analyzes your mood using AI facial recognition, and provides personalized music playlists from Spotify and other free music sources.

![Mood Melodies App](./assets/images/Logo%20Trans.png)

## 📱 Features

### 🎯 Core Functionality

- **📸 Photo Capture**: Take photos using device camera
- **🤖 AI Mood Analysis**: Real-time facial emotion detection using face-api.js
- **🎵 Smart Music Recommendations**: Curated playlists based on detected emotions
- **🎧 Integrated Music Player**: Play, pause, skip, and control music playback
- **💾 Mood History**: Track your emotional journey over time
- **🔐 User Authentication**: Secure login/signup with Supabase

### 🎭 Supported Emotions

- **😊 Happy** - Upbeat, energetic tracks
- **😢 Sad** - Melancholic, emotional ballads
- **😠 Angry** - Rock, intense music
- **😌 Calm** - Peaceful, relaxing sounds
- **😰 Anxious** - Soothing, calming melodies
- **😲 Surprised** - Discovery mix, unexpected genres
- **🤢 Disgusted** - Alternative, raw music

### 🎼 Music Sources

- **🎯 Primary**: Spotify Web API (10M+ tracks)
- **🔄 Fallback**: Curated free audio for guaranteed playback
- **🎚️ Quality**: High-quality audio streaming with metadata

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
- **Spotify Web API** for music data

### 🎵 Audio Integration

- **Spotify Web API** with Client Credentials flow
- **Reliable fallback system** with tested audio URLs
- **Cross-platform audio playback** via Expo AV

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

#### Spotify API Setup (Optional)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create new app
3. Update `lib/musicService.ts`:

```typescript
const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const clientSecret = 'YOUR_SPOTIFY_CLIENT_SECRET';
```

For detailed Spotify setup, see: [SPOTIFY-SETUP.md](./SPOTIFY-SETUP.md)

### 3. Start Development Server

```bash
# Start Expo development server
npx expo start

# For tunnel (remote testing)
npx expo start --tunnel
```

### 4. Start Face API Service (for real mood analysis)

```bash
# In a separate terminal
cd face-api-service
npm install
npm start
```

## 📱 Installation & Usage

### Development Testing

1. **Install Expo Go** on your mobile device
2. **Scan QR code** from terminal or use tunnel URL
3. **Allow camera permissions** when prompted

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
- **🤖 AI Analysis**: Real-time mood detection
- **📊 Results**: View detected emotion with confidence score

### 3. Music Discovery

- **🎵 Smart Playlists**: Auto-generated based on mood
- **🎯 Spotify Integration**: Real tracks with metadata
- **🔄 Fallback System**: Guaranteed music playback

### 4. Music Experience

- **🎧 Integrated Player**: Play/pause, seek, skip
- **📱 Intuitive Controls**: Seamless mobile experience
- **💾 History**: Track your mood and music journey

## 🏗️ Architecture

### Project Structure

```
mood-melodies-app/
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   ├── capture.tsx        # Photo capture screen
│   ├── analyzing.tsx      # Mood analysis screen
│   └── player.tsx         # Music player screen
├── lib/                   # Core services
│   ├── supabase.ts        # Database client
│   ├── musicService.ts    # Music API integration
│   └── faceApiService.ts  # Mood analysis client
├── components/            # Reusable UI components
├── context/              # React context providers
├── face-api-service/     # Node.js API server
└── assets/               # Images and static files
```

### Key Services

#### MusicService (`lib/musicService.ts`)

- **Spotify API integration** with access token management
- **Smart fallback system** for guaranteed playback
- **Cross-platform audio** playback via Expo AV
- **Error handling** and retry logic

#### Face API Service (`face-api-service/`)

- **Express server** for mood analysis
- **face-api.js integration** for emotion detection
- **Image processing** and confidence scoring
- **RESTful API** endpoints

## 🔧 Configuration

### Music Service Configuration

The app uses a robust music system with multiple sources:

1. **Primary**: Spotify Web API
2. **Fallback**: Tested audio URLs for guaranteed playback
3. **Mood Mapping**: Smart genre selection based on emotions

### API Endpoints

- **Mood Analysis**: `http://localhost:3001/analyze-mood`
- **Health Check**: `http://localhost:3001/health`

## 🐛 Troubleshooting

### Common Issues

#### 1. Camera Permissions

```bash
# Add to app.json
"permissions": ["CAMERA", "CAMERA_ROLL"]
```

#### 2. Audio Playback Issues

- Ensure **Expo AV** is properly installed
- Check **audio URLs** are accessible
- Verify **device audio settings**

#### 3. Face API Service

- Ensure **Node.js service** is running on port 3001
- Check **network connectivity** between app and server
- Verify **face-api.js models** are loaded

#### 4. Spotify Integration

- Verify **Client ID and Secret** are correct
- Check **internet connectivity**
- Ensure **Spotify app** is not blocking API access

### Debug Mode

Enable detailed logging:

```typescript
// In musicService.ts
console.log(
  `📊 Spotify tracks: ${songs.length} total, ${tracksWithPreviews.length} with previews`
);
```

## 📚 Documentation

### Additional Guides

- **[Spotify Setup Guide](./SPOTIFY-SETUP.md)** - Complete Spotify API integration
- **[Music Playback Guide](./MUSIC-PLAYBACK-GUIDE.md)** - Audio system details
- **[Testing Guide](./TESTING-GUIDE.md)** - QA and testing procedures
- **[Startup Guide](./STARTUP-GUIDE.md)** - Detailed setup instructions

### API Reference

- **Mood Analysis**: POST `/analyze-mood` with image data
- **Music Search**: Spotify Web API integration
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

## 🤝 Contributing

### Development Setup

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Expo** best practices

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **face-api.js** for facial emotion recognition
- **Spotify** for music data and API
- **Supabase** for backend services
- **Expo** for cross-platform development
- **React Native** community for excellent tools

## 📞 Support

### Get Help

- **📧 Email**: sandunhmadhushan@gmail.com
- **🐛 Issues**: [GitHub Issues](https://github.com/sandunMadhushan/mood-melodies-app/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/sandunMadhushan/mood-melodies-app/discussions)

### Version

**Current Version**: 1.0.0  
**Last Updated**: August 28, 2025

---

_Transform your emotions into musical experiences_ 🎵✨
