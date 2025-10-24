import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function StopwatchScreen() {
  const [timeInMs, setTimeInMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const startTime = Date.now() - timeInMs;
    intervalRef.current = setInterval(() => {
      setTimeInMs(Date.now() - startTime);
    }, 100); 

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    scale.value = withSpring(isRunning ? 1 : 1.1, {}, () => {
      scale.value = withSpring(1);
    }); 
  };

  const resetTimer = () => {
    if (isRunning) setIsRunning(false);
    setTimeInMs(0);
    if (intervalRef.current) clearInterval(intervalRef.current); 
    scale.value = withSpring(1); 
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10); 
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };
  
  const animatedPlayButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <StyledText type="title" style={styles.screenTitle}>Kronometre</StyledText>
        
        <View style={styles.card}>
          <StyledText style={styles.timerText}>
            {formatTime(timeInMs)}
          </StyledText>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={resetTimer} style={styles.controlButton} disabled={timeInMs === 0 && !isRunning}>
            <Ionicons name="refresh" size={32} color={Colors.light.text} />
          </TouchableOpacity>
          <Pressable onPress={toggleTimer}>
            <Animated.View style={[styles.playButton, animatedPlayButtonStyle]}>
              <Ionicons 
                name={isRunning ? "pause" : "play"} 
                size={48} 
                color={Colors.light.background}
                style={!isRunning ? styles.playIconOffset : {}}
              />
            </Animated.View>
          </Pressable>
          <View style={styles.controlButton} /> 
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      alignItems: 'center', 
      backgroundColor: 'transparent',
      paddingHorizontal: 20, 
      paddingTop: 10, 
    },
    screenTitle: {
        marginBottom: 30, 
        color: Colors.light.text,
    },
    card: {
      width: '100%',
      maxWidth: 350, 
      height: 250,
      backgroundColor: Colors.light.cardBackground,
      borderWidth: 1,
      borderColor: Colors.light.cardBorder,
      borderRadius: 20, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerText: {
      fontSize: 75, 
      fontWeight: '600', 
      color: Colors.light.text,
      fontVariant: ['tabular-nums'],
      lineHeight: 85, 
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%', 
      maxWidth: 300, 
      marginTop: 60, 
    },
    controlButton: {
      width: 60, 
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      backgroundColor: Colors.light.tint,
      width: 80, 
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: Colors.light.tint,
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowOffset: {width: 0, height: 3}
    },
    playIconOffset: {
      marginLeft: 5, 
    },
});