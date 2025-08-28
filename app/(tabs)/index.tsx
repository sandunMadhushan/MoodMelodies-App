import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  const handleCapture = () => {
    // TODO: Navigate to camera/mood capture screen
    console.log('Capture pressed');
  };

  const getUserFirstName = () => {
    return user?.firstName || user?.full_name?.split(' ')[0] || 'User';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('@/assets/images/Logo Trans.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Main Content Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#7B0057', '#9B1B6B']}
            locations={[0, 1]}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Text style={styles.greeting}>Hi {getUserFirstName()},</Text>
              <Text style={styles.tagline}>
                Discover your mood and find your{'\n'}perfect playlist
              </Text>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
                activeOpacity={0.8}
              >
                <Text style={styles.captureButtonText}>Capture</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E6F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 280,
    height: 40,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 120, // Space for tab bar
  },
  card: {
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  cardContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 42,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  captureButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
    fontWeight: '600',
  },
});