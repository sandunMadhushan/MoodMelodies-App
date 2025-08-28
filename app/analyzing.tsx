import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AnalyzingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to mood result after analysis is complete
          setTimeout(() => {
            router.replace('/mood-result');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7B0057', '#9B1B6B']}
        locations={[0, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Analyzing your{'\n'}mood...</Text>

          {/* Phone with Analysis Overlay */}
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              {/* Phone Frame */}
              <View style={styles.phoneFrame}>
                {/* Notch */}
                <View style={styles.notch} />
                
                {/* Screen Content */}
                <View style={styles.screen}>
                  {/* Corner brackets */}
                  <View style={[styles.bracket, styles.topLeft]} />
                  <View style={[styles.bracket, styles.topRight]} />
                  <View style={[styles.bracket, styles.bottomLeft]} />
                  <View style={[styles.bracket, styles.bottomRight]} />
                  
                  {/* Mood indicators */}
                  <View style={styles.moodIndicators}>
                    <View style={[styles.moodIcon, styles.sadIcon]}>
                      <Text style={styles.moodEmoji}>☹️</Text>
                    </View>
                    <View style={[styles.moodIcon, styles.happyIcon, styles.activeMood]}>
                      <Text style={styles.moodEmoji}>😊</Text>
                    </View>
                    <View style={[styles.moodIcon, styles.neutralIcon]}>
                      <Text style={styles.moodEmoji}>😐</Text>
                    </View>
                  </View>
                  
                  {/* User avatar/photo area */}
                  <View style={styles.userPhotoArea}>
                    <View style={styles.userAvatar}>
                      <View style={styles.avatarHead} />
                      <View style={styles.avatarBody} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Analysis illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
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
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 42,
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  phone: {
    position: 'relative',
  },
  phoneFrame: {
    width: 200,
    height: 400,
    backgroundColor: '#000000',
    borderRadius: 40,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 25,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  bracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#7B0057',
    borderWidth: 3,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 20,
    right: 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  moodIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  activeMood: {
    backgroundColor: '#E91E63',
    transform: [{ scale: 1.2 }],
  },
  sadIcon: {},
  happyIcon: {},
  neutralIcon: {},
  moodEmoji: {
    fontSize: 20,
  },
  userPhotoArea: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  userAvatar: {
    width: 80,
    height: 100,
    alignItems: 'center',
  },
  avatarHead: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4A574',
    marginBottom: 5,
  },
  avatarBody: {
    width: 60,
    height: 45,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  illustration: {
    width: 200,
    height: 150,
    opacity: 0.8,
  },
});