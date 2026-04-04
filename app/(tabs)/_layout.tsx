import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import ChartBarIcon from '@/components/icons/ChartBarIcon';
import WorldIcon from '@/components/icons/WorldIcon';
import DialpadIcon from '@/components/icons/DialpadIcon';
import GearIcon from '@/components/icons/GearIcon';
import { Header } from '@/components/layout/Header';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: '#9ca3af',
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
  tabBar: {
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
