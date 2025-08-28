# 🎵 Spotify Web API Setup Guide

## 🎯 **Current Music System:**

### **What's Used Now:**

✅ **Local Fallback Tracks** - Reliable Google Cloud Storage URLs  
⚠️ **Spotify API** - Available but requires setup (see below)  
❌ **Jamendo/Freesound APIs** - Removed (authentication issues)

---

## 🚀 **Spotify Web API Integration**

### **Why Spotify?**

- ✅ **30-second previews** for all tracks (perfect for mobile apps)
- ✅ **Massive music library** (100M+ songs)
- ✅ **Advanced search** with mood, genre, energy filters
- ✅ **High-quality metadata** (artist, album, artwork)
- ✅ **Free tier available** (Client Credentials flow)

---

## 📝 **Step 1: Register Spotify App**

### **1. Create Spotify Developer Account:**

1. Go to **https://developer.spotify.com/**
2. Click **"Dashboard"** → **"Log in"**
3. Use your Spotify account or create one
4. Accept Developer Terms of Service

### **2. Create New App:**

1. Click **"Create app"**
2. Fill out the form:
   - **App Name:** `Mood Melodies`
   - **App Description:** `Mobile app that recommends music based on facial mood analysis`
   - **Website:** `https://example.com` (placeholder is fine)
   - **Redirect URI:** `https://localhost:3000/callback` (required but won't be used)
   - **API Used:** Web API
3. **Important:** Check **"Client Credentials Flow"** in the settings
4. Click **"Save"**

### **3. Get Your Credentials:**

After creating the app:

- **Client ID** (public) - Copy this
- **Client Secret** (private) - Copy this, keep secure

---

## ⚠️ **Common Setup Issues:**

### **"Redirect URI Required" Error:**

- **Problem:** Spotify now requires at least one redirect URI (even for Client Credentials)
- **Solution:** Use `https://localhost:3000/callback` (it won't actually be used)
- **Why:** Spotify validates the field but your app won't use redirects

### **Valid Redirect URI Options:**

- ✅ `https://localhost:3000/callback` (recommended for development)
- ✅ `https://example.com/callback` (if you prefer a placeholder)
- ✅ `https://yourdomain.com/callback` (if you have a website)

### **Which Authentication Flow:**

- ✅ **Client Credentials Flow** - Perfect for your use case
- ❌ **Authorization Code Flow** - Requires user login (overkill for previews)
- ❌ **Implicit Grant Flow** - Deprecated and unnecessary

---

## 🔧 **Step 2: Configure Your App**

### **1. Update musicService.ts:**

```typescript
// Replace these lines in fetchFromSpotify():
const clientId = 'YOUR_ACTUAL_CLIENT_ID_HERE';
const clientSecret = 'YOUR_ACTUAL_CLIENT_SECRET_HERE';
```

### **2. Uncomment Spotify Code:**

In `lib/musicService.ts`, uncomment the Spotify implementation (lines marked with `/*` and `*/`)

### **3. Environment Variables (Recommended):**

Create `.env` file:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Then update the code:

```typescript
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
```

---

## 🎵 **Step 3: How It Works**

### **Spotify Search by Mood:**

```typescript
const moodQueries = {
  Happy: 'genre:pop mood:happy energy:high',
  Sad: 'genre:indie mood:sad energy:low',
  Angry: 'genre:rock mood:angry energy:high',
  Calm: 'genre:ambient mood:chill energy:low',
  // ... more moods
};
```

### **Audio Playback:**

- **Preview URLs:** 30-second clips (perfect for mood testing)
- **High Quality:** 128kbps MP3 streams
- **No Authentication Required:** For preview playback

---

## 💰 **Cost & Limits**

### **Free Tier (Client Credentials):**

- ✅ **100% Free** for preview playback
- ✅ **100,000 requests/month**
- ✅ **30-second previews** for all tracks
- ✅ **No user login required**

### **Limitations:**

- ⚠️ **Preview only** (30 seconds per track)
- ⚠️ **No full playback** (requires Spotify Premium + user auth)
- ⚠️ **Rate limited** (reasonable limits for mobile apps)

---

## 🛠 **Step 4: Implementation Example**

### **Current Fallback → Spotify Flow:**

```
1. User captures photo → Mood detected
2. Try Spotify API → Get mood-based tracks
3. If Spotify fails → Use local fallback
4. Play 30-second previews
```

### **Code Structure:**

```typescript
// 1. Get Spotify access token
const token = await getSpotifyToken(clientId, clientSecret);

// 2. Search by mood
const tracks = await searchSpotifyTracks(mood, token);

// 3. Format for your app
const playlist = formatSpotifyPlaylist(tracks, mood);

// 4. Play preview URLs with expo-av
await musicService.playTrack(playlist.songs[0]);
```

---

## 🎯 **Step 5: Advanced Features**

### **Mood-Based Search Parameters:**

```typescript
// Fine-tune searches for better mood matching
const searchParams = {
  Happy: 'energy:0.7-1.0 valence:0.7-1.0 danceability:0.6-1.0',
  Sad: 'energy:0.0-0.4 valence:0.0-0.3 acousticness:0.3-1.0',
  Angry: 'energy:0.8-1.0 loudness:-5-0 tempo:120-200',
  Calm: 'energy:0.0-0.5 acousticness:0.5-1.0 instrumentalness:0.3-1.0',
};
```

### **Track Filtering:**

```typescript
// Only get tracks with previews
.filter(track => track.preview_url)
// Prefer popular tracks
.sort((a, b) => b.popularity - a.popularity)
// Remove explicit content (optional)
.filter(track => !track.explicit)
```

---

## 🚀 **Quick Start Commands:**

### **1. Install Spotify SDK (optional):**

```bash
npm install spotify-web-api-node
```

### **2. Test Spotify Connection:**

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
     -d "grant_type=client_credentials"
```

### **3. Search Test:**

```bash
curl -X GET "https://api.spotify.com/v1/search?q=mood:happy&type=track&limit=5" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📱 **User Experience:**

### **With Spotify Integration:**

1. **Capture mood** → Instant analysis
2. **Get Spotify tracks** → Real, popular music
3. **Play 30-second previews** → Perfect for mood testing
4. **Discover new music** → Based on actual mood

### **Fallback System:**

- **Primary:** Spotify API (when configured)
- **Secondary:** Local tracks (always works)
- **Result:** Never fails, always plays music

---

## 🎉 **Benefits:**

✅ **Real Music:** Actual popular songs instead of samples  
✅ **Mood Accuracy:** Spotify's advanced audio analysis  
✅ **Always Fresh:** New music discoveries  
✅ **Professional Quality:** High-quality previews  
✅ **Free to Use:** No cost for preview playback

---

## 🔧 **Next Steps:**

1. **Register Spotify App** (5 minutes)
2. **Update credentials** in musicService.ts
3. **Uncomment Spotify code**
4. **Test with real music!** 🎵

Your app will transform from demo tracks to real Spotify music recommendations! 🚀
