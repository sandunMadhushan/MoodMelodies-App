import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MusicScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8E6F1', '#E6B3D6', '#7B0057']}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Music</Text>
          <Text style={styles.subtitle}>Your playlists will appear here</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
});
