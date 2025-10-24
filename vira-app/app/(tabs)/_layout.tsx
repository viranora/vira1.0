import { Header } from '@/components/Header';
import { TabBarIcon } from '@/components/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint, 
        tabBarInactiveTintColor: Colors.dark.tabIconDefault, 
        header: () => <Header />,

        tabBarBackground: () => (
          <BlurView 
            intensity={90} 
            tint="dark" 
            style={{ 
              flex: 1,
              borderTopWidth: 1, 
              borderTopColor: Colors.dark.glassBorder
            }} 
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent', 
          position: 'absolute',
          borderTopWidth: 0, 
        },
      }}>
      <Tabs.Screen
        name="pano"
        options={{
          title: 'Pano',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'grid' : 'grid'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Görevler',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />,
        }}
      />
    </Tabs>
  );
}