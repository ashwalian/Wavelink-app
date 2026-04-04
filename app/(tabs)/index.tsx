import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import { COUNTRIES } from '@/constants/countries';

export default function DataPlansScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Popular Countries</Text>
        <View style={styles.list}>
          {COUNTRIES.map((country) => (
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
    paddingBottom: 120, // Extra space for tabs
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: 0.5,
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
});
