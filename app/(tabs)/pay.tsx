import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

type CountryOption = {
  code: string;
  label: string;
};

export default function PayAndFlyScreen() {
  const router = useRouter();

  const countries = useMemo<CountryOption[]>(
    () => [
      { code: 'GB', label: 'United Kingdom' },
      { code: 'US', label: 'United States' },
      { code: 'JP', label: 'Japan' },
    ],
    [],
  );

  const countryFlags = useMemo<Record<string, string>>(
    () => ({
      GB: '🇬🇧',
      US: '🇺🇸',
      JP: '🇯🇵',
    }),
    [],
  );

  const bg = '#ffffff';
  const titleC = '#000000';
  const subC = '#000000';
  const cardBg = 'rgba(255,255,255,0.75)';
  const cardBorder = '#e2e8f0';
  const sectionBg = '#0f172a';
  const sectionCard = '#111827';
  const sectionBorder = '#1f2937';
  const sectionText = '#ffffff';

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/hand-painted-blue-sky-background-with-fluffy-white-clouds_1048-18892.jpg',
      }}
      style={[styles.container, { backgroundColor: bg }]}
      imageStyle={styles.bgImage}
    >
      <View style={[styles.bgOverlay, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.badge, { color: titleC, borderColor: cardBorder }]}> ✈️ PAY AS YOU GO PLAN</Text>

        <Text style={[styles.heroTitle, { color: titleC }]}>More data, less cost .{'\n'}JustPay & Fly .</Text>
        <Text style={[styles.heroDesc, { color: subC }]}>
          Provider-level rates , no hidden fee.{'\n'}Set up for eSIM once - use it forever .
        </Text>

        <Pressable style={[styles.infoRow, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/help')}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoRowTitle, { color: titleC }]}>Show compatible devices</Text>
            <Text style={[styles.infoRowDesc, { color: subC }]}>Open Help Center to check supported phones.</Text>
          </View>
          <Text style={[styles.chev, { color: subC }]}>▸</Text>
        </Pressable>

        <View style={[styles.planSectionWrap, { borderColor: sectionBorder, backgroundColor: sectionBg }]}>
          <View style={[styles.countryBox, { backgroundColor: sectionCard, borderColor: sectionBorder }]}>
          <Text style={[styles.countryTitle, { color: sectionText }]}>Country quick plans</Text>
          <Text style={[styles.planCaption, { color: sectionText }]}>pay per go plane</Text>
          {countries.map((country, idx) => (
            <View
              key={country.code}
              style={[styles.planRow, idx === countries.length - 1 && styles.lastPlanRow, { borderBottomColor: sectionBorder }]}
            >
              <Text numberOfLines={1} style={[styles.planName, { color: sectionText }]}>
                {countryFlags[country.code]} {country.label}
              </Text>
              <Text style={[styles.planPrice, { color: sectionText }]}>Coming soon</Text>
            </View>
          ))}
          </View>
        </View>

        <Pressable
          style={[styles.workCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
          onPress={() => router.push('/help')}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.workTitle, { color: titleC }]}>How Pay & Fly work</Text>
            <Text style={[styles.workDesc, { color: subC }]}>
              Open quick guide with activation steps, payment flow, and support.
            </Text>
          </View>
          <Text style={[styles.chev, { color: subC }]}>›</Text>
        </Pressable>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    resizeMode: 'cover',
    opacity: 1,
  },
  bgOverlay: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
    marginBottom: 10,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16,
  },
  infoRow: {
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  infoRowTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoRowDesc: {
    marginTop: 4,
    fontSize: 12,
  },
  chev: {
    fontSize: 22,
    fontWeight: '700',
  },
  countryBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  planSectionWrap: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 22,
    padding: 10,
    zIndex: 30,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  countryTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  planCaption: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  lastPlanRow: {
    borderBottomWidth: 0,
  },
  planName: {
    fontSize: 13,
    flex: 1,
  },
  planPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  noDataText: {
    fontSize: 13,
  },
  workCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  workDesc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
});
