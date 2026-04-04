import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemePreference } from '@/features/theme/theme-preference-provider';

export default function PayAndFlyScreen() {
  const { isDarkMode } = useThemePreference();
  const bg = isDarkMode ? '#0a0a0a' : '#ffffff';
  const titleC = isDarkMode ? '#ffffff' : '#0f172a';
  const subC = isDarkMode ? '#9ca3af' : '#64748b';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: titleC }]}>Pay and Fly</Text>
      <Text style={[styles.subtitle, { color: subC }]}>Book your flights and pay with crypto.</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  placeholder: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  placeholderText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});
