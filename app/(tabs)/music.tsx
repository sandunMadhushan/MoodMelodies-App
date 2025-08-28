import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { faceApiService } from '../../lib/faceApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with 30px padding on each side and 15px gap

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  mood: string;
}

export default function MusicScreen() {
  const [currentMood, setCurrentMood] = useState<string>('Happy');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    loadCurrentMood();
  }, []);

  useEffect(() => {
    generatePlaylists();
  }, [currentMood]);

  const loadCurrentMood = async () => {
    try {
      const savedMood = await AsyncStorage.getItem('lastAnalyzedMood');
      if (savedMood) {
        setCurrentMood(savedMood);
      }
    } catch (error) {
      console.log('No saved mood found, using default');
    }
  };

  const generatePlaylists = () => {
    const moodPlaylists: { [key: string]: Playlist[] } = {
      Happy: [
        {
          id: '1',
          name: 'Happy Hits',
          description: 'Upbeat songs to keep your energy high',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Happy',
        },
        {
          id: '2',
          name: 'Feel Good Vibes',
          description: 'Songs that make you smile',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Happy',
        },
        {
          id: '3',
          name: 'Dance Party',
          description: 'Get moving with these beats',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Happy',
        },
        {
          id: '4',
          name: 'Summer Vibes',
          description: 'Sunny day soundtrack',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Happy',
        },
      ],
      Sad: [
        {
          id: '5',
          name: 'Melancholic Melodies',
          description: 'Songs for when you need to feel',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Sad',
        },
        {
          id: '6',
          name: 'Emotional Ballads',
          description: 'Heartfelt songs for reflection',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Sad',
        },
        {
          id: '7',
          name: 'Rainy Day Blues',
          description: 'Perfect for contemplative moments',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Sad',
        },
        {
          id: '8',
          name: 'Healing Hearts',
          description: 'Music to mend and comfort',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Sad',
        },
      ],
      Calm: [
        {
          id: '9',
          name: 'Peaceful Piano',
          description: 'Gentle melodies for relaxation',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Calm',
        },
        {
          id: '10',
          name: 'Ambient Chill',
          description: 'Atmospheric sounds for focus',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Calm',
        },
        {
          id: '11',
          name: 'Nature Sounds',
          description: 'Connect with tranquility',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Calm',
        },
        {
          id: '12',
          name: 'Meditation Music',
          description: 'Mindful listening experience',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Calm',
        },
      ],
      Angry: [
        {
          id: '13',
          name: 'Rock Anthems',
          description: 'Channel your energy',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Angry',
        },
        {
          id: '14',
          name: 'Heavy Metal',
          description: 'Intense and powerful',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Angry',
        },
        {
          id: '15',
          name: 'Punk Rock',
          description: 'Raw and energetic',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Angry',
        },
        {
          id: '16',
          name: 'Power Songs',
          description: 'Empowering anthems',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Angry',
        },
      ],
      Anxious: [
        {
          id: '17',
          name: 'Calming Instrumentals',
          description: 'Soothing sounds to ease anxiety',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Anxious',
        },
        {
          id: '18',
          name: 'Gentle Acoustic',
          description: 'Soft melodies for peace',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Anxious',
        },
        {
          id: '19',
          name: 'Mindfulness',
          description: 'Music for present moment awareness',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Anxious',
        },
        {
          id: '20',
          name: 'Breathing Space',
          description: 'Create room to breathe',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Anxious',
        },
      ],
      Surprised: [
        {
          id: '21',
          name: 'Discovery Mix',
          description: 'New sounds to explore',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Surprised',
        },
        {
          id: '22',
          name: 'Energetic Pop',
          description: 'Uplifting and exciting',
          image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Surprised',
        },
        {
          id: '23',
          name: 'Feel Good Mix',
          description: 'Surprising favorites',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Surprised',
        },
        {
          id: '24',
          name: 'Adventure Soundtrack',
          description: 'Music for new experiences',
          image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
          mood: 'Surprised',
        },
      ],
    };

    setPlaylists(moodPlaylists[currentMood] || moodPlaylists['Happy']);
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    console.log('Selected playlist:', playlist.name);
    // TODO: Navigate to playlist details or start playing
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

  const renderPlaylistCard = (playlist: Playlist, index: number) => (
    <TouchableOpacity
      key={playlist.id}
      style={[styles.playlistCard, { width: cardWidth }]}
      onPress={() => handlePlaylistPress(playlist)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageOverlay}
        />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.playlistDescription} numberOfLines={2}>
          {playlist.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your{'\n'}playlist</Text>
          <View style={styles.moodIndicator}>
            <Text style={styles.moodText}>
              Based on your{' '}
              <Text style={[styles.moodHighlight, { color: getMoodColor(currentMood) }]}>
                {currentMood.toLowerCase()}
              </Text>{' '}
              mood
            </Text>
          </View>
        </View>

        {/* Playlists Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.playlistsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.playlistsGrid}>
            {playlists.map((playlist, index) => renderPlaylistCard(playlist, index))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0F8',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D2D2D',
    lineHeight: 38,
    marginBottom: 12,
    fontWeight: '600',
  },
  moodIndicator: {
    marginTop: 8,
  },
  moodText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  moodHighlight: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  playlistsContainer: {
    paddingHorizontal: 30,
    paddingBottom: 120, // Space for tab bar
  },
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  playlistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  playlistImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  playlistInfo: {
    padding: 16,
  },
  playlistName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D2D2D',
    marginBottom: 6,
    fontWeight: '600',
  },
  playlistDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    lineHeight: 18,
  },
});