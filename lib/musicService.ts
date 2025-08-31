import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { audioAssets, demoAudioAssets, AudioAsset } from './audioAssets';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image: string;
  duration: number;
  url: string;
  preview_url: string;
  asset?: any; // Audio asset from require()
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  mood: string;
  songs: Song[];
}

class MusicService {
  private sound: Audio.Sound | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
      console.log('🎵 Audio system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
    }
  }

  // Get playlists based on mood
  async getPlaylistByMood(mood: string): Promise<Playlist> {
    console.log(`🎵 Loading playlist for mood: ${mood}`);
    console.log(`📁 Looking in: assets/audio/${mood.toLowerCase()}/`);

    return this.getLocalPlaylist(mood);
  }

  // Get local playlist with your actual music files
  private getLocalPlaylist(mood: string): Playlist {
    console.log(`📁 Loading songs for ${mood} mood`);

    // Convert audioAssets to Song format and use actual bundled files
    const moodKey = mood.toLowerCase() as keyof typeof audioAssets;
    const assets = audioAssets[moodKey] || audioAssets.happy;

    const songs: Song[] = assets.map((asset: AudioAsset) => ({
      id: asset.id,
      title: asset.title,
      artist: asset.artist,
      image: asset.image,
      duration: asset.duration,
      url: '', // Will use asset instead
      preview_url: '', // Will use asset instead
      asset: asset.asset, // This is the bundled audio file
    }));

    console.log(`🎵 Loaded ${songs.length} songs for ${mood} mood`);
    console.log(
      `� These are actual bundled assets in: assets/audio/${mood.toLowerCase()}/`
    );

    return {
      id: `bundled_${mood.toLowerCase()}`,
      name: this.getPlaylistName(mood),
      description: this.getPlaylistDescription(mood),
      mood,
      songs,
    };
  }

  private getPlaylistName(mood: string): string {
    const names: { [key: string]: string } = {
      Happy: 'Local Feel Good Hits',
      Sad: 'Local Emotional Ballads',
      Angry: 'Local Rock Anthems',
      Calm: 'Local Peaceful Moments',
      Anxious: 'Local Calming Sounds',
      Surprised: 'Local Discovery Mix',
      Disgusted: 'Local Raw & Real',
    };
    return names[mood] || 'Local Mixed Collection';
  }

  private getPlaylistDescription(mood: string): string {
    const descriptions: { [key: string]: string } = {
      Happy:
        'Your local upbeat songs - Ed Sheeran, Justin Bieber, Justin Timberlake',
      Sad: 'Your local melancholic melodies for reflection',
      Angry: 'Your local powerful tracks to channel energy',
      Calm: 'Your local peaceful compositions for relaxation',
      Anxious: 'Your local gentle sounds to ease the mind',
      Surprised: 'Your local Taylor Swift surprise songs and discoveries',
      Disgusted: 'Your local authentic music for real moments',
    };
    return descriptions[mood] || 'Your curated local collection';
  }

  async playTrack(song: Song): Promise<void> {
    try {
      console.log(`🎵 Loading BUNDLED track: ${song.title} by ${song.artist}`);
      console.log(
        `� Using bundled asset from: assets/audio/[mood]/${song.title}.mp3`
      );

      // CRITICAL: Stop and clean up any existing audio completely
      await this.cleanup();

      // Small delay to ensure complete cleanup
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use bundled asset if available, otherwise fallback to demo
      const audioSource = song.asset || demoAudioAssets.demo1;

      // Create new sound object with bundled asset
      const { sound } = await Audio.Sound.createAsync(audioSource, {
        shouldPlay: false, // Don't auto-play, we'll control it manually
        isLooping: false,
        volume: 1.0,
      });

      this.sound = sound;

      // Start playing after setup is complete
      await this.sound.playAsync();

      if (song.asset) {
        console.log('✅ BUNDLED track loaded and playing');
      } else {
        console.log(
          '✅ Demo track loaded and playing (add your MP3 files to assets/audio/)'
        );
      }

      // Set up playback status listener
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          console.log(
            `🎵 Position: ${status.positionMillis}ms / ${status.durationMillis}ms`
          );
        }
      });
    } catch (error) {
      console.error('❌ Error playing BUNDLED track:', error);
      throw new Error(`Failed to play ${song.title}: ${error}`);
    }
  }

  async pauseTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
      console.log('⏸️ LOCAL track paused');
    }
  }

  async resumeTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
      console.log('▶️ LOCAL track resumed');
    }
  }

  async stopTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
      console.log('⏹️ LOCAL track stopped');
    }
  }

  async getPlaybackStatus(): Promise<any> {
    if (this.sound) {
      try {
        const status = await this.sound.getStatusAsync();
        console.log('📊 Playback status retrieved');
        return status;
      } catch (error) {
        console.error('❌ Error getting playback status:', error);
        return null;
      }
    }
    return null;
  }

  async setPosition(positionMillis: number): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.setPositionAsync(positionMillis);
        console.log(`⏭️ Seeked to position: ${positionMillis}ms`);
      } catch (error) {
        console.error('❌ Error seeking position:', error);
      }
    }
  }

  async getCurrentPosition(): Promise<number> {
    if (this.sound) {
      try {
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded) {
          return status.positionMillis || 0;
        }
      } catch (error) {
        console.error('❌ Error getting current position:', error);
      }
    }
    return 0;
  }

  async getDuration(): Promise<number> {
    if (this.sound) {
      try {
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded) {
          return status.durationMillis || 0;
        }
      } catch (error) {
        console.error('❌ Error getting duration:', error);
      }
    }
    return 0;
  }

  async isPlaying(): Promise<boolean> {
    if (this.sound) {
      try {
        const status = await this.sound.getStatusAsync();
        return status.isLoaded && status.isPlaying;
      } catch (error) {
        console.error('❌ Error checking playing status:', error);
      }
    }
    return false;
  }

  async cleanup(): Promise<void> {
    if (this.sound) {
      try {
        // Stop the sound first
        await this.sound.stopAsync();
        console.log('⏹️ Sound stopped');

        // Then unload it completely
        await this.sound.unloadAsync();
        console.log('🗑️ Sound unloaded');

        // Clear the reference
        this.sound = null;
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
        // Force clear the reference even if cleanup fails
        this.sound = null;
      }
    }
    console.log('🧹 LOCAL music service cleaned up');
  }
}

export const musicService = new MusicService();
