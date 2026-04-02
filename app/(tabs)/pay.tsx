import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PayAndFlyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay and Fly</Text>
      <Text style={styles.subtitle}>Book your flights and pay with crypto.</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
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
