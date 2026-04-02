import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import MoonIcon from '@/components/icons/MoonIcon';
import BrightnessDownIcon from '@/components/icons/BrightnessDownIcon';

export default function ProfileScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Dynamic styles based on theme
  const themeContainer = [styles.container, !isDarkMode && styles.lightContainer];
  const themeText = [styles.itemText, !isDarkMode && styles.lightText];
  const themeTitle = [styles.title, !isDarkMode && styles.lightText];
  const themeCard = [styles.card, !isDarkMode && styles.lightCard];

  return (
    <View style={themeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Back button */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backButton, !isDarkMode && styles.lightBackButton]}>← Back</Text>
          </Pressable>
          <Text style={themeTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Section 1: Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={themeCard}>
            <View style={styles.item}>
              <Text style={themeText}>Account Settings</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <View>
                <Text style={themeText}>Gmail</Text>
                <Text style={styles.itemSubText}>user@gmail.com</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={themeText}>Purchase History</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={themeText}>Currency</Text>
              <Text style={styles.itemSubText}>USD ($)</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info</Text>
          <View style={themeCard}>
            <View style={styles.item}>
              <Text style={themeText}>Info about Airalo</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={themeText}>Rate this app</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
          </View>
        </View>

        {/* Section 3: Application */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={themeCard}>
            <Pressable style={styles.item} onPress={toggleTheme}>
              <View>
                <Text style={themeText}>Appearance</Text>
                <Text style={styles.itemSubText}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
              </View>
              {isDarkMode ? (
                <MoonIcon size={24} color="#4f46e5" />
              ) : (
                <BrightnessDownIcon size={24} color="#f59e0b" />
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  lightContainer: {
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
  },
  lightBackButton: {
    color: '#3730a3',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  lightCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  lightText: {
    color: '#111827',
  },
  itemSubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
});
