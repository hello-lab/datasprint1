import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  // For demo purposes, we'll use local storage instead of API calls
  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists
      const existingUser = await AsyncStorage.getItem(`user_${username}`);
      if (existingUser) {
        Alert.alert('Error', 'User already exists');
        return;
      }

      // Create user
      const userData = {
        username,
        password,
        balance: 100000, // Starting balance like in original app
        stepcount: 0,
        transactions: [],
      };

      await AsyncStorage.setItem(`user_${username}`, JSON.stringify(userData));
      Alert.alert('Success', 'User created successfully', [
        { text: 'OK', onPress: () => setIsSignup(false) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem(`user_${username}`);
      if (!userData) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const user = JSON.parse(userData);
      if (user.password !== password) {
        Alert.alert('Error', 'Invalid password');
        return;
      }

      // Store current user session
      await AsyncStorage.setItem('currentUser', username);
      navigation.replace('MainApp');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/longlogo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup 
              ? 'Join the StepUp wellness community' 
              : 'Sign in to continue your wellness journey'
            }
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Sign In')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => setIsSignup(!isSignup)}
            >
              <Text style={styles.switchModeText}>
                {isSignup 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1c4',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3871f5',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3871f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#3871f5',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;