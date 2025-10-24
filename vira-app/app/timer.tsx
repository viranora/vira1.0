import { ScreenBackground } from '@/components/ScreenBackground';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const PRESET_TIMES = [1, 5, 10, 15]; 

export default function TimerScreen() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('00');
  const [inputSeconds, setInputSeconds] = useState('00');

  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const selectTime = (minutes: number) => {
    if (isRunning) return;
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setInputMinutes(String(minutes).padStart(2, '0'));
    setInputSeconds('00');
    setIsEditing(false);
  };

  const toggleTimer = () => {
    if (remainingSeconds === 0) return;
    if (isEditing) setIsEditing(false);
    Keyboard.dismiss(); 
    
    setIsRunning(!isRunning);
    scale.value = withSpring(isRunning ? 1 : 1.1, {}, () => {
      scale.value = withSpring(1);
    }); 
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    if (intervalRef.current) clearInterval(intervalRef.current); 
    scale.value = withSpring(1); 
  };

  const handleMinuteChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, '');
    if (val === '') {
      setInputMinutes('00');
      return;
    }
    if (parseInt(val) > 59) setInputMinutes('59');
    else setInputMinutes(val);
  };

  const handleSecondChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, '');
    if (val === '') {
      setInputSeconds('00');
      return;
    }
    if (parseInt(val) > 59) setInputSeconds('59');
    else setInputSeconds(val);
  };

  const setTimeFromInput = () => {
    Keyboard.dismiss();
    const mins = parseInt(inputMinutes) || 0;
    const secs = parseInt(inputSeconds) || 0;
    const newTotal = (mins * 60) + secs;
    
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (isRunning) return;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    setInputMinutes(String(mins).padStart(2, '0'));
    setInputSeconds(String(secs).padStart(2, '0'));
    setIsEditing(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const animatedPlayButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <StyledText type="title" style={styles.screenTitle}>Zamanlayıcı</StyledText>
        
        <View style={styles.card}>
          {isEditing && !isRunning ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.timerInput}
                value={inputMinutes}
                onChangeText={handleMinuteChange}
                onBlur={() => setInputMinutes(inputMinutes.padStart(2, '0'))}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                selectionColor={Colors.light.tint}
              />
              <StyledText style={styles.timerTextSeparator}>:</StyledText>
              <TextInput
                style={styles.timerInput}
                value={inputSeconds}
                onChangeText={handleSecondChange}
                onBlur={() => setInputSeconds(inputSeconds.padStart(2, '0'))}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                selectionColor={Colors.light.tint}
              />
            </View>
          ) : (
            <Pressable onPress={startEditing}>
              <StyledText style={styles.timerText}>
                {formatTime(remainingSeconds)}
              </StyledText>
            </Pressable>
          )}
        </View>

        {isEditing && !isRunning ? (
          <View style={styles.editingControls}>
            <StyledButton 
              title="Ayarla" 
              type="primary" 
              onPress={setTimeFromInput} 
              style={styles.setButton}
            />
          </View>
        ) : (
          <View style={styles.presetContainer}>
            {PRESET_TIMES.map((min) => (
              <TouchableOpacity 
                key={min} 
                style={[styles.presetChip, totalSeconds === min * 60 && styles.activeChip]}
                onPress={() => selectTime(min)}
                disabled={isRunning} 
              >
                <StyledText 
                    style={[styles.chipText, totalSeconds === min * 60 && styles.activeChipText]}
                >
                  {min} dak
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={resetTimer} style={styles.controlButton} disabled={totalSeconds === 0}>
            <Ionicons name="refresh" size={32} color={Colors.light.text} />
          </TouchableOpacity>
          <Pressable onPress={toggleTimer}>
            <Animated.View style={[styles.playButton, animatedPlayButtonStyle]}>
              <Ionicons 
                name={isRunning ? "pause" : "play"} 
                size={48} 
                color={Colors.light.background} // Buton içi renk
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
      fontSize: 90, 
      fontWeight: '600', 
      color: Colors.light.text,
      fontVariant: ['tabular-nums'],
      lineHeight: 100, 
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerInput: {
      fontSize: 90,
      fontWeight: '600',
      color: Colors.light.text,
      textAlign: 'center',
      width: 120, 
    },
    timerTextSeparator: {
      fontSize: 80,
      fontWeight: '600',
      color: Colors.light.tabIconDefault,
      marginHorizontal: -10,
    },
    editingControls: {
      width: '100%',
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 30,
    },
    setButton: {
      width: '80%',
      maxWidth: 300,
    },
    presetContainer: {
      flexDirection: 'row',
      justifyContent: 'center', 
      gap: 12, 
      width: '100%',
      marginTop: 40, 
      marginBottom: 30, 
    },
    presetChip: {
      backgroundColor: Colors.light.cardBackground,
      borderWidth: 1,
      borderColor: Colors.light.cardBorder,
      paddingVertical: 10,
      paddingHorizontal: 18, 
      borderRadius: 25, 
    },
    activeChip: {
      backgroundColor: Colors.light.tint,
      borderColor: Colors.light.tint,
    },
    chipText: {
      color: Colors.light.text,
      fontSize: 16, 
    },
    activeChipText: {
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%', 
      maxWidth: 300, 
      marginTop: 20, 
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