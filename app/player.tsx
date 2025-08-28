import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  duration: number;
}

export default function PlayerScreen() {
  const { playlistName, mood } = useLocalSearchParams<{
    playlistName: string;
    mood: string;
  }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const [currentSong, setCurrentSong] = useState<Song>({
    id: '1',
    title: playlistName || 'Happier',
    artist: 'Marshmello, Bastille',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 180,
  });

  // Simulate playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentTime(0);
    // TODO: Load previous song
  };

  const handleNext = () => {
    setCurrentTime(0);
    // TODO: Load next song
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

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
            onPress={() => router.back()}
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
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
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