import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
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

const POPULAR_COUNTRY_CODES = ['US', 'GB', 'AE', 'IN', 'TH', 'TR', 'SA', 'FR']

export default function DataPlansScreen() {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()
  const [searchValue, setSearchValue] = useState('')

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

  const filteredCountries = useMemo(() => {
    const term = searchValue.trim().toLowerCase()
    if (!term) return countries
    return countries.filter((country) => {
      const title = country.title.toLowerCase()
      const code = country.country_code.toLowerCase()
      return title.includes(term) || code.includes(term)
    })
  }, [countries, searchValue])

  const popularCountries = useMemo(() => {
    const popularSet = new Set(POPULAR_COUNTRY_CODES)
    const hits = filteredCountries.filter((country) => popularSet.has(country.country_code.trim()))
    return hits.sort(
      (a, b) =>
        POPULAR_COUNTRY_CODES.indexOf(a.country_code.trim()) -
        POPULAR_COUNTRY_CODES.indexOf(b.country_code.trim()),
    )
  }, [filteredCountries])

  const allDestinations = useMemo(() => {
    const popularSet = new Set(popularCountries.map((country) => country.country_code.trim()))
    return filteredCountries.filter((country) => !popularSet.has(country.country_code.trim()))
  }, [filteredCountries, popularCountries])

  const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
  const headingC = isDarkMode ? '#ffffff' : '#0f172a'
  const subC = isDarkMode ? '#9ca3af' : '#64748b'
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'
  const pressedBg = isDarkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.1)'
  const pressedBorder = isDarkMode ? 'rgba(99,102,241,0.35)' : '#818cf8'
  const chevron = isDarkMode ? '#9ca3af' : '#94a3b8'
  const inputBg = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'
  const inputBorder = isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: headingC }]}>Where are you travelling next ?</Text>
        <Text style={[styles.subheading, { color: subC }]}>
          Wavelink helps you find travel eSIM plans in seconds.
        </Text>
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search your destination"
          placeholderTextColor={subC}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.searchInput,
            {
              color: headingC,
              backgroundColor: inputBg,
              borderColor: inputBorder,
            },
          ]}
        />

        {packagesQuery.isLoading && (
          <View style={styles.banner}>
            <ActivityIndicator color="#818cf8" />
            <Text style={[styles.bannerText, { color: subC }]}>Loading countries…</Text>
          </View>
        )}

        {packagesQuery.isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load destinations</Text>
            <Text style={styles.errorBody}>{(packagesQuery.error as Error).message}</Text>
            <Text style={[styles.errorHint, { color: subC }]}>
              Please check your internet connection and restart the app.
            </Text>
          </View>
        )}

        {popularCountries.length > 0 ? (
          <>
            <Text style={[styles.sectionHeading, { color: headingC }]}>Popular</Text>
            <View style={styles.list}>
              {popularCountries.map((country) => (
                <CountryCard
                  key={`${country.country_code}-${country.slug}`}
                  country={country}
                  headingC={headingC}
                  subC={subC}
                  chevron={chevron}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                  pressedBg={pressedBg}
                  pressedBorder={pressedBorder}
                  onPress={() =>
                    router.push({
                      pathname: '/country/[countryCode]',
                      params: { countryCode: country.country_code.trim() },
                    })
                  }
                />
              ))}
            </View>
          </>
        ) : null}

        <Text style={[styles.sectionHeading, { color: headingC }]}>All destinations</Text>
        <View style={styles.list}>
          {allDestinations.map((country) => (
            <CountryCard
              key={`${country.country_code}-${country.slug}`}
              country={country}
              headingC={headingC}
              subC={subC}
              chevron={chevron}
              cardBg={cardBg}
              cardBorder={cardBorder}
              pressedBg={pressedBg}
              pressedBorder={pressedBorder}
              onPress={() =>
                router.push({
                  pathname: '/country/[countryCode]',
                  params: { countryCode: country.country_code.trim() },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

function CountryCard({
  country,
  headingC,
  subC,
  chevron,
  cardBg,
  cardBorder,
  pressedBg,
  pressedBorder,
  onPress,
}: {
  country: AiraloCatalogCountry
  headingC: string
  subC: string
  chevron: string
  cardBg: string
  cardBorder: string
  pressedBg: string
  pressedBorder: string
  onPress: () => void
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.countryCard,
        { backgroundColor: cardBg, borderColor: cardBorder },
        pressed && {
          backgroundColor: pressedBg,
          borderColor: pressedBorder,
        },
      ]}
      onPress={onPress}
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
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    fontWeight: '500',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 22,
    outlineColor: 'transparent',
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
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
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
