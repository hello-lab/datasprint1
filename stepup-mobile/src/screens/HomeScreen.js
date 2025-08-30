import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';

const HomeScreen = () => {
  const [phase, setPhase] = useState('Inhale');
  const [animatedValue] = useState(new Animated.Value(120));

  useEffect(() => {
    let inhale = true;
    const phaseInterval = setInterval(() => {
      inhale = !inhale;
      setPhase(inhale ? 'Inhale' : 'Exhale');
    }, 4000);

    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    const targetSize = phase === 'Inhale' ? 180 : 120;
    
    Animated.timing(animatedValue, {
      toValue: targetSize,
      duration: 3800,
      useNativeDriver: false,
    }).start();
  }, [phase]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/longlogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Breathing Exercise */}
      <View style={styles.breathingContainer}>
        <Text style={styles.title}>Breathing Exercise</Text>
        <Text style={styles.phaseText}>{phase}</Text>
        
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                width: animatedValue,
                height: animatedValue,
              },
            ]}
          >
            <Text style={styles.emoji}>
              {phase === 'Inhale' ? '🫁' : '💨'}
            </Text>
          </Animated.View>
        </View>

        <Text style={styles.instruction}>
          Follow the circle: Inhale as it grows, exhale as it shrinks. 
          Repeat for a few cycles to relax and refocus.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1c4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  logo: {
    width: 150,
    height: 50,
    borderRadius: 8,
  },
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3871f5',
    marginBottom: 20,
    textAlign: 'center',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3871f5',
    marginBottom: 30,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  breathingCircle: {
    borderRadius: 500,
    backgroundColor: '#aee1f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3871f5',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  emoji: {
    fontSize: 24,
    color: '#fff',
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;