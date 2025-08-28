import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { faceApiService } from '../lib/faceApiService';

const getMoodDescription = (mood: string) => {
  switch (mood) {
    case 'Happy':
      return "You're awesome! You feel great today,\nlet's keep up the good vibe";
    case 'Sad':
      return "It's okay to feel down sometimes.\nLet's find some uplifting music";
    case 'Angry':
      return "Let's channel that energy into some\npowerful music";
    case 'Calm':
      return "You seem peaceful and relaxed.\nLet's find some soothing melodies";
    case 'Anxious':
      return "Take a deep breath. Let's find some\ncalming music to help you relax";
    case 'Surprised':
      return "Something caught your attention!\nLet's discover some new music";
    case 'Disgusted':
      return "Let's cleanse your mood with some\nfresh, positive vibes";
    default:
      return "Let's find some music that matches your mood";
  }
};

const getMoodColor = (mood: string): string => {
  const moodColors: { [key: string]: string } = {
    Happy: '#FFD700',
    Sad: '#4169E1',
    Angry: '#DC143C',
    Calm: '#32CD32',
    Anxious: '#FF8C00',
    Surprised: '#FF69B4',
    Disgusted: '#8B4513',
  };
  return moodColors[mood] || '#FFFFFF';
};

const getMoodEmoji = (mood: string): string => {
  const moodEmojis: { [key: string]: string } = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😠',
    Calm: '😌',
    Anxious: '😰',
    Surprised: '😲',
    Disgusted: '🤢',
  };
  return moodEmojis[mood] || '😐';
};

export default function MoodResultScreen() {
  const { mood, confidence, photoUri } = useLocalSearchParams<{
    mood: string;
    confidence: string;
    photoUri: string;
  }>();

  const currentMood = mood || 'Happy';
  const playlists = faceApiService.getMoodBasedPlaylist(currentMood);

  const handleExploreMusic = () => {
    router.push('/(tabs)/music');
  };

  const handleRetakePhoto = () => {
    router.push('/capture');
  };

  const handleGoHome = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7B0057', '#9B1B6B']}
        locations={[0, 1]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Mood Analysis</Text>
            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            )}
          </View>

          {/* Mood Result */}
          <View style={styles.moodContainer}>
            <Text
              style={[styles.moodEmoji, { color: getMoodColor(currentMood) }]}
            >
              {getMoodEmoji(currentMood)}
            </Text>
            <Text style={styles.moodLabel}>Your mood is</Text>
            <Text
              style={[styles.moodText, { color: getMoodColor(currentMood) }]}
            >
              {currentMood}
            </Text>
            {confidence && (
              <Text style={styles.confidenceText}>
                {(parseFloat(confidence) * 100).toFixed(1)}% confidence
              </Text>
            )}
            <Text style={styles.moodDescription}>
              {getMoodDescription(currentMood)}
            </Text>
          </View>

          {/* Music Recommendations */}
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>
              Recommended Playlists for You
            </Text>
            <Text style={styles.recommendationsSubtitle}>
              Based on your {currentMood.toLowerCase()} mood
            </Text>

            <View style={styles.playlistsContainer}>
              {playlists.map((playlist, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.playlistCard,
                    { borderColor: getMoodColor(currentMood) },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleExploreMusic}
                >
                  <View style={styles.playlistIcon}>
                    <Text style={styles.playlistEmoji}>🎵</Text>
                  </View>
                  <Text style={styles.playlistName}>{playlist}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: getMoodColor(currentMood) },
              ]}
              onPress={handleExploreMusic}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Explore Music</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleRetakePhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Retake Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGoHome}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Go Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  moodLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  moodText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
  },
  moodDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  recommendationsContainer: {
    marginBottom: 40,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 25,
  },
  playlistsContainer: {
    gap: 15,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    padding: 15,
  },
  playlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  playlistEmoji: {
    fontSize: 20,
  },
  playlistName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  actionsContainer: {
    gap: 20,
  },
  primaryButton: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
});
