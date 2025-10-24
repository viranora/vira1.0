import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

// Koyu, sofistike gradyan
const gradientColors = ['#2a2a40', '#1a1a2a'];

export function ScreenBackground({ children }: Props) {
  return (
    <LinearGradient
      colors={gradientColors as unknown as LinearGradientProps['colors']} 
      style={styles.container}
    >
      {/* Blob'lar kaldırıldı */}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // overflow: 'hidden', // Artık gerekli değil
  },
});


