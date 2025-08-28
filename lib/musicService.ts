import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image: string;
  duration: number;
  url: string;
  preview_url: string;
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

  // Get curated playlists based on mood
  async getPlaylistByMood(mood: string): Promise<Playlist> {
    console.log(`🎵 Fetching playlist for mood: ${mood}`);

    try {
      // Try Spotify API first (requires setup)
      try {
        return await this.fetchFromSpotify(mood);
      } catch (spotifyError) {
        console.warn(
          '❌ Spotify failed, using local fallback...',
          spotifyError
        );

        // Use local fallback
        return this.getFallbackPlaylist(mood);
      }
    } catch (error) {
      console.error('❌ Music API failed:', error);
      // Always provide fallback
      return this.getFallbackPlaylist(mood);
    }
  }

  private async fetchFromSpotify(mood: string): Promise<Playlist> {
    // Spotify Web API implementation
    const clientId = '933b8082a051465bb4137262d0ea7bf6'; // Your client ID
    const clientSecret = '3bd19e948c2e4714992d8473ae59eb0d'; // Your secret

    try {
      // Get access token using Client Credentials flow
      const tokenResponse = await fetch(
        'https://accounts.spotify.com/api/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
          body: 'grant_type=client_credentials',
        }
      );

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Map moods to Spotify search queries - simplified for better results
      const moodQueries: { [key: string]: string } = {
        Happy: 'genre:pop',
        Sad: 'genre:indie',
        Angry: 'genre:rock',
        Calm: 'genre:ambient',
        Anxious: 'genre:classical',
        Surprised: 'genre:electronic',
        Disgusted: 'genre:alternative',
      };

      const query = moodQueries[mood] || 'genre:pop';

      // Search for tracks
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchResponse.json();

      if (!searchData.tracks || searchData.tracks.items.length === 0) {
        // Try a broader search if genre-specific search fails
        console.log(`No tracks found for ${query}, trying broader search...`);

        const broadQuery =
          mood === 'Angry' ? 'rock' : mood === 'Sad' ? 'ballad' : 'pop';
        const fallbackResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${broadQuery}&type=track&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const fallbackData = await fallbackResponse.json();
        if (!fallbackData.tracks || fallbackData.tracks.items.length === 0) {
          throw new Error('No Spotify tracks found');
        }

        // Update searchData with fallback results
        searchData.tracks = fallbackData.tracks;
      }

      const songs: Song[] = searchData.tracks.items.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        album: track.album?.name || '',
        image: track.album?.images[0]?.url || this.getDefaultImage(mood),
        duration: Math.floor(track.duration_ms / 1000),
        url: track.preview_url || this.getFallbackAudioUrl(mood), // Use fallback if no preview
        preview_url: track.preview_url || this.getFallbackAudioUrl(mood),
      }));

      // Debug logging
      const tracksWithPreviews = songs.filter((song) =>
        song.url.startsWith('https://p.scdn.co')
      );
      console.log(
        `📊 Spotify tracks: ${songs.length} total, ${tracksWithPreviews.length} with previews`
      );

      console.log(`✅ Spotify found ${songs.length} tracks for ${mood}`);

      return {
        id: `spotify_${mood.toLowerCase()}`,
        name: this.getPlaylistName(mood),
        description: `${this.getPlaylistDescription(mood)} (Spotify)`,
        mood,
        songs,
      };
    } catch (error) {
      console.error('❌ Spotify API error:', error);
      throw error;
    }
  }

  private getFallbackPlaylist(mood: string): Playlist {
    // Working URLs from reliable free sources - using only tested URLs
    const fallbackSongs: { [key: string]: Song[] } = {
      Happy: [
        {
          id: '1',
          title: 'Happy Upbeat',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 180,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        },
        {
          id: '2',
          title: 'Cheerful Melody',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
      ],
      Sad: [
        {
          id: '3',
          title: 'Melancholy',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
        {
          id: '4',
          title: 'Emotional Ballad',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 180,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        },
      ],
      Angry: [
        {
          id: '5',
          title: 'Rock Power',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
        {
          id: '6',
          title: 'Heavy Energy',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 180,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        },
      ],
      Calm: [
        {
          id: '7',
          title: 'Peaceful',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
        {
          id: '8',
          title: 'Serene Sounds',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 180,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        },
      ],
      Anxious: [
        {
          id: '9',
          title: 'Soothing',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
      ],
      Surprised: [
        {
          id: '10',
          title: 'Energetic',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 180,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        },
      ],
      Disgusted: [
        {
          id: '11',
          title: 'Alternative',
          artist: 'Sample Music',
          image:
            'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 121,
          url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
          preview_url:
            'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        },
      ],
    };

    const songs = fallbackSongs[mood] || fallbackSongs['Happy'];
    console.log(
      `✅ Using fallback playlist for ${mood} (${songs.length} songs)`
    );

    return {
      id: `fallback_${mood.toLowerCase()}`,
      name: this.getPlaylistName(mood),
      description: `${this.getPlaylistDescription(mood)} (Demo)`,
      mood,
      songs,
    };
  }

  async playTrack(song: Song): Promise<void> {
    try {
      console.log(`🎵 Loading track: ${song.title} by ${song.artist}`);

      // Stop current track if playing
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Create new sound object
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.url },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 1.0,
        }
      );

      this.sound = sound;
      console.log('✅ Track loaded and playing');

      // Set up playback status listener
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          console.log(
            `🎵 Position: ${status.positionMillis}ms / ${status.durationMillis}ms`
          );
        }
      });
    } catch (error) {
      console.error('❌ Error playing track:', error);
      throw new Error(`Failed to play ${song.title}: ${error}`);
    }
  }

  async pauseTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
      console.log('⏸️ Track paused');
    }
  }

  async resumeTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
      console.log('▶️ Track resumed');
    }
  }

  async stopTrack(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      console.log('⏹️ Track stopped');
    }
  }

  async getPlaybackStatus(): Promise<any> {
    if (this.sound) {
      return await this.sound.getStatusAsync();
    }
    return null;
  }

  async setPosition(positionMillis: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(positionMillis);
    }
  }

  private getPlaylistName(mood: string): string {
    const names: { [key: string]: string } = {
      Happy: 'Feel Good Hits',
      Sad: 'Melancholic Melodies',
      Angry: 'Rock Anthems',
      Calm: 'Peaceful Moments',
      Anxious: 'Calming Sounds',
      Surprised: 'Discovery Mix',
      Disgusted: 'Alternative Vibes',
    };
    return names[mood] || 'Mixed Playlist';
  }

  private getPlaylistDescription(mood: string): string {
    const descriptions: { [key: string]: string } = {
      Happy: 'Upbeat songs to keep your energy high',
      Sad: 'Songs for when you need to feel',
      Angry: 'Channel your energy with powerful music',
      Calm: 'Gentle melodies for relaxation',
      Anxious: 'Soothing sounds to ease anxiety',
      Surprised: 'New sounds to explore',
      Disgusted: 'Raw and authentic music',
    };
    return descriptions[mood] || 'A curated mix for your mood';
  }

  private getDefaultImage(mood: string): string {
    const images: { [key: string]: string } = {
      Happy:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      Sad: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
      Angry:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      Calm: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    };
    return images[mood] || images['Happy'];
  }

  private getFallbackAudioUrl(mood: string): string {
    // Only use tested, working audio URLs
    const fallbackUrls: { [key: string]: string } = {
      Happy:
        'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
      Sad: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
      Angry:
        'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
      Calm: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
      Anxious:
        'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
      Surprised:
        'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
      Disgusted:
        'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
    };
    return fallbackUrls[mood] || fallbackUrls['Happy'];
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const musicService = new MusicService();
