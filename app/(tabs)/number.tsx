import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import { COUNTRIES } from '@/constants/countries';

const PREVIEW_COUNT = 3;

export default function VirtualNumberScreen() {
  const preview = COUNTRIES.slice(0, PREVIEW_COUNT);
  const hasMore = COUNTRIES.length > PREVIEW_COUNT;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Virtual Number</Text>
        <Text style={styles.subtitle}>Get a second phone number for privacy.</Text>

        <Text style={styles.sectionLabel}>Your eSIM regions</Text>
        <View style={styles.list}>
          {preview.map((country) => (
            <View key={country.id} style={styles.countryCard}>
              <View style={styles.countryLeft}>
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
              </View>
              <View style={styles.countryRight}>
                <ChevronRightIcon size={20} color="#9ca3af" />
              </View>
            </View>
          ))}
          {hasMore && (
            <View style={styles.moreRow}>
              <Text style={styles.moreHint}>+{COUNTRIES.length - PREVIEW_COUNT} more</Text>
              <ChevronRightIcon size={20} color="#9ca3af" />
            </View>
          )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
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
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    gap: 12,
  },
  countryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  countryRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.25)',
  },
  moreHint: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a5b4fc',
  },
});
