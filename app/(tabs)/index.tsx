import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    // Simulate authentication
    Alert.alert(
      'Success',
      isLogin ? 'Login successful!' : 'Account created successfully!',
      [{ text: 'OK' }]
    );
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <Image 
              source={require('@/assets/images/Logo Trans.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Main Content */}
          <LinearGradient
            colors={['#7B0057', '#9B1B6B', '#7B0057']}
            locations={[0, 0.6, 1]}
            style={styles.authContainer}>
            <View style={styles.authContent}>
              <Text style={styles.title}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Personalize your experience' : 'Create your account'}
              </Text>

              <View style={styles.formContainer}>
                {!isLogin && (
                  <>
                    <View style={styles.nameContainer}>
                      <TextInput
                        style={[styles.input, styles.nameInput]}
                        placeholder="First Name"
                        placeholderTextColor="#E8D8E8"
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                        autoCapitalize="words"
                      />
                      <TextInput
                        style={[styles.input, styles.nameInput]}
                        placeholder="Last Name"
                        placeholderTextColor="#E8D8E8"
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                        autoCapitalize="words"
                      />
                    </View>
                  </>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#E8D8E8"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#E8D8E8"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoCapitalize="none"
                />

                {!isLogin && (
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#E8D8E8"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <TouchableOpacity onPress={toggleAuthMode} activeOpacity={0.7}>
                  <Text style={styles.switchLink}>
                    {isLogin ? 'Sign Up' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0F8',
    paddingTop: 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 40,
  },
  authContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: '65%',
  },
  authContent: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: -2,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E8D8E8',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  formContainer: {
    marginBottom: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 18,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  nameInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#7B0057',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E8D8E8',
    opacity: 0.8,
  },
  switchLink: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});