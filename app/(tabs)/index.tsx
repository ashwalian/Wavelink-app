import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import {
  getAiraloPackages,
  countryCodeToFlagEmoji,
  isAiraloCatalogCountry,
  type AiraloCatalogCountry,
} from '@/lib/airalo'
import { useThemePreference } from '@/features/theme/theme-preference-provider'

export default function DataPlansScreen() {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()

  const packagesQuery = useQuery({
    queryKey: ['airalo', 'packages', 'local', 'all'],
    queryFn: () =>
      getAiraloPackages({
        filterType: 'local',
        // Omit limit per docs for full local catalogue in one response
      }),
    staleTime: 1000 * 60 * 30,
  })

  const countries: AiraloCatalogCountry[] = useMemo(() => {
    const rows = packagesQuery.data?.data
    if (!Array.isArray(rows)) return []
    return rows
      .filter(isAiraloCatalogCountry)
      .filter((c) => typeof c.country_code === 'string' && c.country_code.trim().length > 0)
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [packagesQuery.data])

  const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
  const headingC = isDarkMode ? '#ffffff' : '#0f172a'
  const subC = isDarkMode ? '#9ca3af' : '#64748b'
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'
  const pressedBg = isDarkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.1)'
  const pressedBorder = isDarkMode ? 'rgba(99,102,241,0.35)' : '#818cf8'
  const chevron = isDarkMode ? '#9ca3af' : '#94a3b8'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: headingC }]}>Countries</Text>
        <Text style={[styles.sub, { color: subC }]}>
          eSIM data plans from Airalo. Tap a country to see operators and packages.
        </Text>

        {packagesQuery.isLoading && (
          <View style={styles.banner}>
            <ActivityIndicator color="#818cf8" />
            <Text style={[styles.bannerText, { color: subC }]}>Loading countries…</Text>
          </View>
        )}

        {packagesQuery.isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load catalogue</Text>
            <Text style={styles.errorBody}>{(packagesQuery.error as Error).message}</Text>
            <Text style={[styles.errorHint, { color: subC }]}>
              Set credentials in .env. On web run{' '}
              <Text style={{ fontWeight: '800' }}>npm run airalo-proxy</Text> in a second terminal and
              keep EXPO_PUBLIC_AIRALO_DEV_PROXY=http://localhost:8787, then restart Expo.
            </Text>
          </View>
        )}

        <View style={styles.list}>
          {countries.map((country) => (
            <Pressable
              key={`${country.country_code}-${country.slug}`}
              style={({ pressed }) => [
                styles.countryCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
                pressed && {
                  backgroundColor: pressedBg,
                  borderColor: pressedBorder,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: '/country/[countryCode]',
                  params: { countryCode: country.country_code.trim() },
                })
              }
            >
              <View style={styles.countryLeft}>
                {country.image?.url ? (
                  <Image
                    source={{ uri: country.image.url }}
                    style={styles.thumb}
                    contentFit="cover"
                    accessibilityLabel={country.title}
                  />
                ) : (
                  <Text style={styles.flag}>{countryCodeToFlagEmoji(country.country_code)}</Text>
                )}
                <View style={styles.countryText}>
                  <Text style={[styles.countryName, { color: headingC }]}>{country.title}</Text>
                  <Text style={[styles.countryCode, { color: subC }]}>{country.country_code}</Text>
                </View>
              </View>
              <View style={styles.countryRight}>
                <ChevronRightIcon size={20} color={chevron} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 15,
  },
  errorBox: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
    marginBottom: 20,
  },
  errorTitle: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorBody: {
    color: '#fecaca',
    fontSize: 14,
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  list: {
    gap: 12,
  },
  countryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  thumb: {
    width: 44,
    height: 33,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  flag: {
    fontSize: 28,
    width: 44,
    textAlign: 'center',
  },
  countryText: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  countryCode: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  countryRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
