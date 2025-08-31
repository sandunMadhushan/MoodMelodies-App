import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { faceApiService, MoodResult } from '../lib/faceApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AnalyzingScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);

// Run mood analysis when photoUri changes
  useEffect(() => {
    if (photoUri) {
      analyzeMood();
    }
  }, [photoUri]);

    // Analyze mood using faceApiService
  const analyzeMood = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      console.log('Starting mood analysis...');
      const result = await faceApiService.analyzeMood(photoUri!);

      setMoodResult(result);
      setIsAnalyzing(false);

      // Save the mood for the music screen
      await AsyncStorage.setItem('lastAnalyzedMood', result.mood);

      console.log('Mood analysis complete:', result);
    } catch (err) {
      console.error('Mood analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);

      Alert.alert(
        'Analysis Failed',
        'Could not analyze your mood. Please try again with a clearer photo.',
        [{ text: 'Try Again', onPress: () => router.back() }, { text: 'OK' }]
      );
    }
  };

  const handleContinue = () => {
    if (moodResult) {
      // Navigate to music tab with the analyzed mood
      router.push('/(tabs)/music');
    }
  };

  // Get color for mood display
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

  // Get emoji for mood display
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7B0057', '#9B1B6B']}
        locations={[0, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Photo Preview */}
          {photoUri && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
            </View>
          )}

          {/* Analysis Content */}
          <View style={styles.analysisContainer}>
            {isAnalyzing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Analyzing your mood...</Text>
                <Text style={styles.loadingSubtext}>
                  Using AI to detect facial expressions
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>😔</Text>
                <Text style={styles.errorTitle}>Analysis Failed</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : moodResult ? (
              <View style={styles.resultContainer}>
                <Text
                  style={[
                    styles.moodEmoji,
                    { color: getMoodColor(moodResult.mood) },
                  ]}
                >
                  {getMoodEmoji(moodResult.mood)}
                </Text>
                <Text style={styles.moodTitle}>Your mood is</Text>
                <Text
                  style={[
                    styles.moodText,
                    { color: getMoodColor(moodResult.mood) },
                  ]}
                >
                  {moodResult.mood}
                </Text>
                <Text style={styles.confidenceText}>
                  {(moodResult.confidence * 100).toFixed(1)}% confidence
                </Text>

                {/* Emotion Breakdown */}
                <View style={styles.emotionsContainer}>
                  <Text style={styles.emotionsTitle}>Emotion Analysis</Text>
                  {Object.entries(moodResult.emotions)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([emotion, value]) => (
                      <View key={emotion} style={styles.emotionRow}>
                        <Text style={styles.emotionName}>
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </Text>
                        <View style={styles.emotionBarContainer}>
                          <View
                            style={[
                              styles.emotionBar,
                              { width: `${value * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.emotionValue}>
                          {(value * 100).toFixed(0)}%
                        </Text>
                      </View>
                    ))}
                </View>

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonText}>
                    Continue to Music
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Styles for AnalyzingScreen components
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
  },
  resultContainer: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  moodText: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 30,
  },
  emotionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  emotionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emotionName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    width: 80,
  },
  emotionBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  emotionBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  emotionValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    width: 35,
    textAlign: 'right',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
    textAlign: 'center',
  },
});
