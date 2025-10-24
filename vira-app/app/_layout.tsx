import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) {
      router.replace('/(auth)');
    } 
    else if (token && inAuthGroup) {
      router.replace('/(tabs)/pano');
    }
    SplashScreen.hideAsync();
  }, [token, loading, segments]);

  if (loading) {
    return null;
  }

  // Modal başlıkları için yeni aydınlık stil
  const modalHeaderStyle = {
    headerStyle: { 
      backgroundColor: Colors.light.header,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light.cardBorder,
      elevation: 0, 
      shadowOpacity: 0, 
    },
    headerTitleStyle: { color: Colors.light.text },
    headerTintColor: Colors.light.tint,
  };

  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      presentation: 'modal', // 'transparentModal' değil, 'modal'
    }}>
      <Stack.Screen name="(tabs)" />
      
      <Stack.Screen name="profile" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Profilim', 
          ...modalHeaderStyle
      }} />
      <Stack.Screen name="settings" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Ayarlar',
          ...modalHeaderStyle
      }} />
      <Stack.Screen name="journal" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Günlük',
          ...modalHeaderStyle
      }} />
      <Stack.Screen name="motivation" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Motivasyon Kartları',
          ...modalHeaderStyle
      }} />
      <Stack.Screen name="timer" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Zamanlayıcı',
          ...modalHeaderStyle
      }} />
      <Stack.Screen name="stopwatch" options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Kronometre',
          ...modalHeaderStyle
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}