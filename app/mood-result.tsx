import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

const getMoodDescription = (mood: string) => {
  switch (mood) {
    case 'Happy':
      return "You're awesome! You feel great today,\nlet's keep up the good vibe";
    case 'Sad':
      return "It's okay to feel down sometimes.\nLet's find some uplifting music";
    case 'Energetic':
      return "You're full of energy today!\nLet's find some exciting tunes";
    case 'Calm':
      return "You seem peaceful and relaxed.\nLet's find some soothing melodies";
    case 'Excited':
      return "You're in high spirits!\nTime for some upbeat music";
    default:
      return "Let's find some music that matches your mood";
  }
};

export default function MoodResultScreen() {
  const params = useLocalSearchParams();
  const mood = (Array.isArray(params.mood) ? params.mood[0] : params.mood) || 'Happy';
  
  const handleSearch = () => {
    // Navigate to music tab or search functionality
    router.replace('/(tabs)/music');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7B0057', '#9B1B6B']}
        locations={[0, 1]}
        style={styles.gradient}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.star, styles.star1]} />
          <View style={[styles.star, styles.star2]} />
          <View style={[styles.star, styles.star3]} />
          <View style={[styles.star, styles.star4]} />
          <View style={[styles.star, styles.star5]} />
          <View style={[styles.star, styles.star6]} />
        </View>

        <View style={styles.content}>
          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>
          </View>

          {/* Mood Result */}
          <Text style={styles.moodTitle}>{mood}!</Text>
          <Text style={styles.moodDescription}>
            {getMoodDescription(mood)}
          </Text>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
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
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  star1: {
    top: '15%',
    left: '20%',
    transform: [{ rotate: '45deg' }],
  },
  star2: {
    top: '25%',
    right: '15%',
    transform: [{ rotate: '45deg' }],
  },
  star3: {
    top: '35%',
    left: '10%',
    transform: [{ rotate: '45deg' }],
  },
  star4: {
    bottom: '30%',
    right: '25%',
    transform: [{ rotate: '45deg' }],
  },
  star5: {
    bottom: '20%',
    left: '30%',
    transform: [{ rotate: '45deg' }],
  },
  star6: {
    bottom: '40%',
    right: '10%',
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    marginBottom: 60,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    overflow: 'hidden',
  },
  avatarHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D4A574',
    marginBottom: 10,
    marginTop: 20,
  },
  avatarBody: {
    width: 120,
    height: 90,
    backgroundColor: '#E91E63',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  moodTitle: {
    fontSize: 48,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  moodDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  searchButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
    fontWeight: '600',
  },
});