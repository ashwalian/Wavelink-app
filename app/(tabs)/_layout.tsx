import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import ChartBarIcon from '@/components/icons/ChartBarIcon';
import WorldIcon from '@/components/icons/WorldIcon';
import DialpadIcon from '@/components/icons/DialpadIcon';
import GearIcon from '@/components/icons/GearIcon';
import { Header } from '@/components/layout/Header';
import { useThemePreference } from '@/features/theme/theme-preference-provider';

export default function TabsLayout() {
  const { isDarkMode } = useThemePreference();

  const tabBarStyle = useMemo(
    () => ({
      ...styles.tabBar,
      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 0.98)' : 'rgba(248, 250, 252, 0.98)',
      borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
    }),
    [isDarkMode],
  );

  const shellBg = isDarkMode ? '#0a0a0a' : '#ffffff';

  return (
    <View style={[styles.shell, { backgroundColor: shellBg }]}>
      <Header />
      <View style={[styles.content, { backgroundColor: shellBg }]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle,
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#64748b',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Data Plans',
              tabBarIcon: ({ color }) => <ChartBarIcon size={24} color={color} />,
              tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>Data Plans</Text>,
            }}
          />
          <Tabs.Screen
            name="pay"
            options={{
              title: 'Pay and Fly',
              tabBarIcon: ({ color }) => <WorldIcon size={24} color={color} />,
              tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>Pay and Fly</Text>,
            }}
          />
          <Tabs.Screen
            name="number"
            options={{
              title: 'Number',
              tabBarIcon: ({ color }) => <DialpadIcon size={24} color={color} />,
              tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>Number</Text>,
            }}
          />
          <Tabs.Screen
            name="help"
            options={{
              title: 'Help',
              tabBarIcon: ({ color }) => <GearIcon size={24} color={color} />,
              tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>Help</Text>,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
