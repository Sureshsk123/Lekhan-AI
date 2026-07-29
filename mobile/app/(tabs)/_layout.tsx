import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Text } from 'react-native';

export default function TabsLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text>,
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Stories',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="ai-tutor"
        options={{
          title: 'AI Tutor',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🤖</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
