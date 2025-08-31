# Demo Audio Files

This directory contains demo audio files for development purposes.

## How to Add Your Own Music:

1. **Add your MP3 files** to the mood-specific folders:

   - `assets/audio/happy/` - for upbeat songs
   - `assets/audio/sad/` - for melancholic songs
   - `assets/audio/calm/` - for peaceful songs
   - `assets/audio/angry/` - for energetic songs

2. **Update the audioAssets.ts file** to reference your actual files:

   ```typescript
   // Replace the require() paths with your actual file names
   asset: require('../assets/audio/happy/your-song.mp3'),
   ```

3. **File naming tips:**
   - Use lowercase with hyphens: `perfect-ed-sheeran.mp3`
   - Avoid spaces and special characters
   - Keep filenames under 50 characters

## Current Setup:

- The app will try to load your actual MP3 files first
- If files are missing, it falls back to demo audio
- Check the console logs to see which files are being used

## Supported Formats:

- MP3 (recommended)
- M4A
- WAV (larger file size)
- AAC
