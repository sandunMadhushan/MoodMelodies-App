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
    return user?.full_name?.split(' ')[0] || 'User';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8E6F1', '#E6B3D6', '#7B0057']}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/Logo Trans.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.greeting}>Hi {getUserFirstName()} ,</Text>
            <Text style={styles.tagline}>
              Discover your mood and find your{'\n'}perfect playlist
            </Text>

            {/* Capture Button */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              activeOpacity={0.8}
            >
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E6F1',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 100,
  },
  logo: {
    width: 280,
    height: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 48,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 60,
    opacity: 0.9,
  },
  captureButton: {
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
  captureButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
    fontWeight: '600',
  },
});
