import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import {
  getAiraloPackages,
  countryCodeToFlagEmoji,
  formatDataAmountMb,
  isAiraloCatalogCountry,
  type AiraloCatalogCountry,
  type AiraloCatalogSimPackage,
} from '@/lib/airalo'
import { formatPlanDisplayPrice } from '@/lib/format-plan-price'
import { useCurrencyPreference } from '@/features/currency/currency-preference-provider'
import { useThemePreference } from '@/features/theme/theme-preference-provider'

export default function CountryPlansScreen() {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()
  const { countryCode: rawCode } = useLocalSearchParams<{ countryCode: string }>()
  const countryCode = (Array.isArray(rawCode) ? rawCode[0] : rawCode)?.toUpperCase() ?? ''

  const query = useQuery({
    queryKey: ['airalo', 'packages', 'local', countryCode],
    queryFn: () =>
      getAiraloPackages({
        filterType: 'local',
        filterCountry: countryCode,
      }),
    enabled: countryCode.length === 2,
  })

  const countries: AiraloCatalogCountry[] = useMemo(() => {
    const rows = query.data?.data
    if (!Array.isArray(rows)) return []
    return rows.filter(isAiraloCatalogCountry)
  }, [query.data])

  const primary = countries[0]

  const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
  const headerBorder = isDarkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const titleC = isDarkMode ? '#ffffff' : '#0f172a'
  const mutedC = isDarkMode ? '#9ca3af' : '#64748b'
  const opTitle = isDarkMode ? '#e5e7eb' : '#1e293b'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: headerBorder }]}>
        <Pressable hitSlop={16} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: titleC }]} numberOfLines={1}>
          {primary
            ? `${countryCodeToFlagEmoji(primary.country_code)} ${primary.country_code}`
            : countryCode || 'Plans'}
        </Text>
        <View style={{ width: 56 }} />
      </View>

      {query.isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#818cf8" />
          <Text style={[styles.muted, { color: mutedC }]}>Loading plans…</Text>
        </View>
      )}

      {query.isError && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load plans</Text>
          <Text style={[styles.muted, { color: mutedC }]}>{(query.error as Error).message}</Text>
        </View>
      )}

      {query.isSuccess && countries.length === 0 && (
        <View style={styles.centered}>
          <Text style={[styles.muted, { color: mutedC }]}>No packages for this country.</Text>
        </View>
      )}

      {primary && (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            {primary.image?.url ? (
              <Image
                source={{ uri: primary.image.url }}
                style={styles.heroImage}
                contentFit="cover"
                accessibilityLabel={primary.title}
              />
            ) : (
              <Text style={styles.heroFlag}>{countryCodeToFlagEmoji(primary.country_code)}</Text>
            )}
            <View style={styles.heroText}>
              <Text style={[styles.countryTitle, { color: titleC }]}>{primary.title}</Text>
              <Text style={[styles.countryMeta, { color: mutedC }]}>
                {countryCodeToFlagEmoji(primary.country_code)} {primary.country_code}
              </Text>
            </View>
          </View>

          {primary.operators.map((op) => (
            <View key={op.id} style={styles.operatorBlock}>
              <Text style={[styles.operatorName, { color: opTitle }]}>{op.title}</Text>
              {op.plan_type ? (
                <Text style={styles.operatorSub}>{op.plan_type}</Text>
              ) : null}
              {op.info?.slice(0, 2).map((line) => (
                <Text key={line} style={[styles.bullet, { color: mutedC }]}>
                  • {line}
                </Text>
              ))}
              <View style={styles.planList}>
                {op.packages.map((pkg) => (
                  <PlanCard key={pkg.id} pkg={pkg} countryCode={primary.country_code} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

function PlanCard({ pkg, countryCode }: { pkg: AiraloCatalogSimPackage; countryCode: string }) {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()
  const { currency } = useCurrencyPreference()
  const dataLabel = formatDataAmountMb(pkg.amount, pkg.is_unlimited)
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const titleC = isDarkMode ? '#fff' : '#0f172a'
  const rowC = isDarkMode ? '#9ca3af' : '#64748b'
  const hintC = isDarkMode ? '#6b7280' : '#94a3b8'
  const priceNum = typeof pkg.price === 'number' ? pkg.price : Number(pkg.price)
  const priceText = Number.isFinite(priceNum)
    ? formatPlanDisplayPrice(priceNum, currency)
    : String(pkg.price)

  const goCheckout = () => {
    router.push({
      pathname: '/checkout',
      params: {
        packageId: pkg.id,
        title: pkg.title,
        price: String(Number.isFinite(priceNum) ? priceNum : ''),
        countryCode: countryCode.trim(),
      },
    })
  }

  return (
    <Pressable
      onPress={goCheckout}
      style={({ pressed }) => [
        styles.planCard,
        { backgroundColor: cardBg, borderColor: cardBorder },
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={styles.planTop}>
        <Text style={[styles.planTitle, { color: titleC }]}>{pkg.title}</Text>
        <Text style={styles.planPrice}>{priceText}</Text>
      </View>
      <Text style={[styles.planRow, { color: rowC }]}>
        {dataLabel} · {pkg.day} days
      </Text>
      {pkg.short_info ? <Text style={[styles.planHint, { color: hintC }]}>{pkg.short_info}</Text> : null}
      {pkg.is_fair_usage_policy && pkg.fair_usage_policy ? (
        <Text style={styles.fairUsage}>Fair use: {pkg.fair_usage_policy}</Text>
      ) : null}
      <Text style={styles.tapHint}>Tap to checkout</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  back: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '600',
    width: 56,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  muted: {
    textAlign: 'center',
    fontSize: 15,
  },
  errorTitle: {
    color: '#f87171',
    fontSize: 17,
    fontWeight: '700',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  heroImage: {
    width: 72,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroFlag: {
    fontSize: 48,
  },
  heroText: {
    flex: 1,
  },
  countryTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  countryMeta: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  operatorBlock: {
    marginBottom: 28,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  operatorSub: {
    fontSize: 13,
    color: '#818cf8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  bullet: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
  planList: {
    marginTop: 14,
    gap: 10,
  },
  planCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  planTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#a5b4fc',
  },
  planRow: {
    fontSize: 14,
    fontWeight: '600',
  },
  planHint: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  fairUsage: {
    marginTop: 10,
    fontSize: 12,
    color: '#fbbf24',
    lineHeight: 16,
  },
  tapHint: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#818cf8',
  },
})
