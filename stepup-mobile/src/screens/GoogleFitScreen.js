import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleFitScreen = () => {
  const [stepData, setStepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = await AsyncStorage.getItem('googleFitConnected');
      setIsConnected(connected === 'true');
      
      if (connected === 'true') {
        loadStepData();
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const loadStepData = async () => {
    try {
      const savedStepData = await AsyncStorage.getItem('stepData');
      if (savedStepData) {
        setStepData(JSON.parse(savedStepData));
      }
    } catch (error) {
      console.error('Error loading step data:', error);
    }
  };

  const simulateGoogleFitConnection = async () => {
    setLoading(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await AsyncStorage.setItem('googleFitConnected', 'true');
      setIsConnected(true);
      Alert.alert('Success', 'Connected to Google Fit successfully!');
      await fetchStepData();
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Google Fit');
    } finally {
      setLoading(false);
    }
  };

  const fetchStepData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Generate mock step data
      const mockStepData = {
        steps: Math.floor(Math.random() * 8000) + 3000, // Random steps between 3000-11000
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        distance: 0,
        calories: 0,
      };

      // Calculate estimated distance and calories
      mockStepData.distance = (mockStepData.steps * 0.762).toFixed(2); // Average step length
      mockStepData.calories = Math.floor(mockStepData.steps * 0.04); // Rough calorie estimate

      setStepData(mockStepData);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('stepData', JSON.stringify(mockStepData));
      
      // Update user's step count
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const userDataString = await AsyncStorage.getItem(`user_${currentUser}`);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.stepcount = mockStepData.steps;
          await AsyncStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
        }
      }
      
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch step data');
    } finally {
      setLoading(false);
    }
  };

  const disconnectGoogleFit = async () => {
    Alert.alert(
      'Disconnect Google Fit',
      'Are you sure you want to disconnect from Google Fit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('googleFitConnected');
              await AsyncStorage.removeItem('stepData');
              setIsConnected(false);
              setStepData(null);
              Alert.alert('Success', 'Disconnected from Google Fit');
            } catch (error) {
              Alert.alert('Error', 'Failed to disconnect');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStepGoalProgress = () => {
    if (!stepData) return 0;
    return Math.min((stepData.steps / 10000) * 100, 100);
  };

  const getStepGoalColor = () => {
    const progress = getStepGoalProgress();
    if (progress >= 100) return '#28a745';
    if (progress >= 70) return '#ffc107';
    return '#dc3545';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="fitness" size={24} color="#fff" />
          <Text style={styles.headerTitle}>Google Fit Integration</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionCard}>
          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isConnected ? '#28a745' : '#dc3545' }
            ]} />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected to Google Fit' : 'Not Connected'}
            </Text>
          </View>
          
          {!isConnected ? (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={simulateGoogleFitConnection}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="link" size={20} color="#fff" />
                  <Text style={styles.connectButtonText}>Connect Google Fit</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={disconnectGoogleFit}
            >
              <Ionicons name="unlink" size={20} color="#dc3545" />
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Step Data Fetch */}
        {isConnected && (
          <View style={styles.fetchCard}>
            <Text style={styles.fetchTitle}>Fetch Your Step Data</Text>
            <Text style={styles.fetchSubtitle}>
              Get your step count from the last 24 hours
            </Text>
            
            <TouchableOpacity
              style={[styles.fetchButton, loading && styles.fetchButtonDisabled]}
              onPress={fetchStepData}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.fetchButtonText}>
                  Fetch Step Data (Last 24 Hours)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step Data Display */}
        {stepData && (
          <View style={styles.dataCard}>
            <View style={styles.stepCountContainer}>
              <Text style={styles.stepCount}>
                {stepData.steps.toLocaleString()}
              </Text>
              <Text style={styles.stepLabel}>Steps</Text>
              <Text style={styles.timeRange}>Last 24 hours</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getStepGoalProgress()}%`,
                      backgroundColor: getStepGoalColor(),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stepData.steps >= 10000 ? (
                  <>🎉 Goal achieved! Great job!</>
                ) : (
                  <>{(10000 - stepData.steps).toLocaleString()} steps to reach 10,000 steps goal</>
                )}
              </Text>
            </View>

            {/* Additional Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="walk" size={24} color="#3871f5" />
                <Text style={styles.statValue}>{stepData.distance}m</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="flame" size={24} color="#ff6b6b" />
                <Text style={styles.statValue}>{stepData.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>

            {/* Time Range */}
            <View style={styles.timeRangeContainer}>
              <Text style={styles.timeRangeTitle}>Time Range:</Text>
              <Text style={styles.timeRangeText}>
                From: {formatDate(stepData.startTime)}
              </Text>
              <Text style={styles.timeRangeText}>
                To: {formatDate(stepData.endTime)}
              </Text>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3871f5" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Google Fit Integration</Text>
            <Text style={styles.infoText}>
              Connect your Google Fit account to automatically track your daily steps 
              and compete on the leaderboard. Your step data helps build a healthier 
              workplace community!
            </Text>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.navigationCard}>
          <TouchableOpacity style={styles.navLink}>
            <Ionicons name="trophy" size={20} color="#3871f5" />
            <Text style={styles.navLinkText}>🏆 View Leaderboard</Text>
          </TouchableOpacity>
          
          <View style={styles.navSeparator} />
          
          <TouchableOpacity style={styles.navLink}>
            <Ionicons name="home" size={20} color="#3871f5" />
            <Text style={styles.navLinkText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3871f5',
    padding: 20,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  connectionCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  connectButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disconnectButton: {
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fetchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fetchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  fetchSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  fetchButton: {
    backgroundColor: '#3871f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  fetchButtonDisabled: {
    opacity: 0.6,
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dataCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28a745',
  },
  stepLabel: {
    fontSize: 18,
    color: '#333',
    marginTop: 4,
  },
  timeRange: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timeRangeContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  timeRangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLinkText: {
    color: '#3871f5',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  navSeparator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
  },
});

export default GoogleFitScreen;