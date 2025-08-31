import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  musicService,
  Song as MusicSong,
  Playlist as MusicPlaylist,
} from '../lib/musicService';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const { playlistName, mood } = useLocalSearchParams<{
    playlistName: string;
    mood: string;
  }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [currentSong, setCurrentSong] = useState<MusicSong | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPlaybackLoading, setIsPlaybackLoading] = useState(false);

  // Load playlist on mount
  useEffect(() => {
    loadPlaylist();
    return () => {
      // Cleanup on unmount
      musicService.cleanup();
    };
  }, [mood]);

  const loadPlaylist = async () => {
    try {
      setIsLoading(true);
      console.log(`🎵 Loading playlist for mood: ${mood}`);

      const fetchedPlaylist = await musicService.getPlaylistByMood(
        mood || 'Happy'
      );
      setPlaylist(fetchedPlaylist);

      if (fetchedPlaylist.songs.length > 0) {
        setCurrentSong(fetchedPlaylist.songs[0]);
        setDuration(fetchedPlaylist.songs[0].duration);
        console.log(
          `✅ Loaded playlist: ${fetchedPlaylist.name} (${fetchedPlaylist.songs.length} songs)`
        );
      }
    } catch (error) {
      console.error('❌ Error loading playlist:', error);
      Alert.alert('Error', 'Failed to load playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor playback status
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && currentSong) {
      interval = setInterval(async () => {
        try {
          const status = await musicService.getPlaybackStatus();
          if (status && status.isLoaded) {
            const position = Math.floor((status.positionMillis || 0) / 1000);
            const duration = Math.floor((status.durationMillis || 0) / 1000);

            // Only update time if not seeking
            if (!isSeeking) {
              setCurrentTime(position);
            }
            setDuration(duration);

            // Check if song ended
            if (status.didJustFinish) {
              handleNext();
            }
          }
        } catch (error) {
          console.error('Error getting playback status:', error);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSong, isSeeking]);

  const togglePlayPause = async () => {
    if (!currentSong || isPlaybackLoading) return;

    try {
      setIsPlaybackLoading(true);

      if (isPlaying) {
        await musicService.pauseTrack();
        setIsPlaying(false);
      } else {
        if (currentTime === 0) {
          // Start playing the song
          console.log('🎯 Starting fresh playback');
          await musicService.playTrack(currentSong);
        } else {
          // Resume playing
          console.log('▶️ Resuming playback');
          await musicService.resumeTrack();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert('Playback Error', 'Failed to play track. Please try again.');
      setIsPlaying(false);
    } finally {
      setIsPlaybackLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (!playlist || playlist.songs.length === 0 || isPlaybackLoading) return;

    try {
      setIsPlaybackLoading(true);

      // Stop current track
      await musicService.stopTrack();

      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : playlist.songs.length - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist.songs[prevIndex]);
      setCurrentTime(0);

      // Auto-play previous song if currently playing
      if (isPlaying) {
        await musicService.playTrack(playlist.songs[prevIndex]);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing previous track:', error);
      setIsPlaying(false);
    } finally {
      setIsPlaybackLoading(false);
    }
  };

  const handleNext = async () => {
    if (!playlist || playlist.songs.length === 0 || isPlaybackLoading) return;

    try {
      setIsPlaybackLoading(true);

      // Stop current track
      await musicService.stopTrack();

      const nextIndex =
        currentIndex < playlist.songs.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist.songs[nextIndex]);
      setCurrentTime(0);

      // Auto-play next song if currently playing
      if (isPlaying) {
        await musicService.playTrack(playlist.songs[nextIndex]);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing next track:', error);
      setIsPlaying(false);
    } finally {
      setIsPlaybackLoading(false);
    }
  };
  const handleBack = async () => {
    try {
      // Stop music when going back
      await musicService.cleanup();
      console.log('🔙 Stopped music and going back');
      router.back();
    } catch (error) {
      console.error('Error during back navigation:', error);
      router.back(); // Go back anyway
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = async (percentage: number) => {
    if (!currentSong || duration === 0) return;

    try {
      const seekTime = Math.floor((percentage / 100) * duration);
      const seekTimeMs = seekTime * 1000;

      console.log(`🎯 Seeking to ${seekTime}s (${seekTimeMs}ms)`);
      await musicService.setPosition(seekTimeMs);
      setCurrentTime(seekTime);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const progressPercentage = (currentTime / duration) * 100;

  // Create PanResponder for seek functionality
  const progressBarWidth = width - 60; // Account for padding
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      setIsSeeking(true);
    },

    onPanResponderMove: (evt) => {
      const x = evt.nativeEvent.locationX;
      const percentage = Math.max(
        0,
        Math.min(100, (x / progressBarWidth) * 100)
      );
      const seekTime = Math.floor((percentage / 100) * duration);
      setCurrentTime(seekTime);
    },

    onPanResponderRelease: (evt) => {
      const x = evt.nativeEvent.locationX;
      const percentage = Math.max(
        0,
        Math.min(100, (x / progressBarWidth) * 100)
      );
      handleSeek(percentage);
      setIsSeeking(false);
    },
  });

  const getMoodColor = (mood: string): [string, string] => {
    const moodGradients: { [key: string]: [string, string] } = {
      Happy: ['#FFD700', '#FFA500'],
      Sad: ['#4169E1', '#1E90FF'],
      Angry: ['#DC143C', '#B22222'],
      Calm: ['#32CD32', '#228B22'],
      Anxious: ['#FF8C00', '#FF6347'],
      Surprised: ['#FF69B4', '#DA70D6'],
      Disgusted: ['#8B4513', '#A0522D'],
    };
    return moodGradients[mood || 'Happy'] || ['#7B0057', '#9B1B6B'];
  };

  const [primaryColor, secondaryColor] = getMoodColor(mood || 'Happy');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[primaryColor, secondaryColor, '#7B0057']}
          locations={[0, 0.6, 1]}
          style={styles.gradient}
        >
          <View
            style={[
              styles.content,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={styles.songTitle}>🎵 Loading playlist...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[primaryColor, secondaryColor, '#7B0057']}
          locations={[0, 0.6, 1]}
          style={styles.gradient}
        >
          <View
            style={[
              styles.content,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={styles.songTitle}>❌ No songs available</Text>
            <TouchableOpacity style={styles.playButton} onPress={handleBack}>
              <Text style={styles.songTitle}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[primaryColor, secondaryColor, '#7B0057']}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Album Art */}
          <View style={styles.albumContainer}>
            <View style={styles.albumArtWrapper}>
              <Image
                source={{ uri: currentSong.image }}
                style={styles.albumArt}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Song Info */}
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{currentSong.title}</Text>
            <Text style={styles.artistName}>{currentSong.artist}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} {...panResponder.panHandlers}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
              {/* Seek thumb */}
              <View
                style={[
                  styles.progressThumb,
                  {
                    left: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                    opacity: isSeeking ? 1 : 0.8,
                  },
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePrevious}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={40}
                color="#FFFFFF"
                style={!isPlaying && { marginLeft: 4 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Bottom Spacer for Tab Bar */}
          <View style={styles.bottomSpacer} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B0057',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  albumContainer: {
    alignItems: 'center',
    marginBottom: 60,
    flex: 1,
    justifyContent: 'center',
  },
  albumArtWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 50,
  },
  songTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  artistName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 12,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomSpacer: {
    height: 100, // Space for tab bar
  },
});
