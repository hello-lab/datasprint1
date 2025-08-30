import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      const currentUsername = await AsyncStorage.getItem('currentUser');
      setCurrentUser(currentUsername);

      // Generate mock leaderboard data
      const mockData = [
        { username: 'FitnessGuru', steps: 15420, rank: 1, daysLogged: 30, isCurrentUser: false },
        { username: 'WalkingChamp', steps: 14850, rank: 2, daysLogged: 28, isCurrentUser: false },
        { username: 'StepMaster', steps: 13290, rank: 3, daysLogged: 25, isCurrentUser: false },
        { username: 'HealthyLife', steps: 12480, rank: 4, daysLogged: 22, isCurrentUser: false },
        { username: 'RunnerPro', steps: 11760, rank: 5, daysLogged: 20, isCurrentUser: false },
        { username: 'ActiveUser', steps: 10950, rank: 6, daysLogged: 18, isCurrentUser: false },
        { username: 'WellnessWarrior', steps: 9830, rank: 7, daysLogged: 15, isCurrentUser: false },
        { username: 'StepCounter', steps: 8640, rank: 8, daysLogged: 12, isCurrentUser: false },
      ];

      // Add current user to leaderboard if not already there
      if (currentUsername) {
        const userDataString = await AsyncStorage.getItem(`user_${currentUsername}`);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userSteps = userData.stepcount || 0;
          
          // Find if current user is already in mock data
          const existingUserIndex = mockData.findIndex(item => item.username === currentUsername);
          
          if (existingUserIndex >= 0) {
            mockData[existingUserIndex].isCurrentUser = true;
            mockData[existingUserIndex].steps = userSteps;
          } else {
            // Add current user to the list
            mockData.push({
              username: currentUsername,
              steps: userSteps,
              rank: mockData.length + 1,
              daysLogged: 1,
              isCurrentUser: true,
            });
          }
        }
      }

      // Sort by steps and update ranks
      mockData.sort((a, b) => b.steps - a.steps);
      mockData.forEach((item, index) => {
        item.rank = index + 1;
      });

      setLeaderboardData(mockData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboardData();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Ionicons name="medal" size={24} color="#FFD700" />;
      case 2:
        return <Ionicons name="medal" size={24} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="medal" size={24} color="#CD7F32" />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        );
    }
  };

  const renderLeaderboardItem = ({ item }) => (
    <View style={[
      styles.leaderboardItem,
      item.isCurrentUser && styles.currentUserItem
    ]}>
      <View style={styles.rankContainer}>
        {getRankIcon(item.rank)}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.username,
          item.isCurrentUser && styles.currentUserText
        ]}>
          {item.username}
          {item.isCurrentUser && ' (You)'}
        </Text>
        <Text style={styles.daysLogged}>
          {item.daysLogged} days logged
        </Text>
      </View>
      
      <View style={styles.stepsContainer}>
        <Text style={[
          styles.stepsCount,
          item.isCurrentUser && styles.currentUserText
        ]}>
          {item.steps.toLocaleString()}
        </Text>
        <Text style={styles.stepsLabel}>steps</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <Text style={styles.subtitle}>
        Step count competition - Last 24 hours
      </Text>
      
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#3871f5" />
          <Text style={styles.statNumber}>{leaderboardData.length}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={styles.statNumber}>
            {leaderboardData.length > 0 ? leaderboardData[0].steps.toLocaleString() : '0'}
          </Text>
          <Text style={styles.statLabel}>Top Steps</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item, index) => `${item.username}-${index}`}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
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
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserItem: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#3871f5',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentUserText: {
    color: '#3871f5',
  },
  daysLogged: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stepsContainer: {
    alignItems: 'flex-end',
  },
  stepsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stepsLabel: {
    fontSize: 12,
    color: '#666',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3871f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default LeaderboardScreen;