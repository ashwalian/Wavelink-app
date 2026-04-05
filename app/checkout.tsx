import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { submitAiraloOrder } from '@/lib/airalo'
import { formatPlanDisplayPrice } from '@/lib/format-plan-price'
import { useThemePreference } from '@/features/theme/theme-preference-provider'
import { useCurrencyPreference } from '@/features/currency/currency-preference-provider'
import { USDC_LOGO_URI_DARK, USDC_LOGO_URI_LIGHT } from '@/constants/usdc-assets'
import { useWebSolanaWallet } from '@/features/wallet/use-web-solana-wallet'

export default function CheckoutScreen() {
  const router = useRouter()
  const { isDarkMode } = useThemePreference()
  const { currency } = useCurrencyPreference()
  const { account } = useMobileWallet()
  const webWallet = useWebSolanaWallet()

  const params = useLocalSearchParams<{
    packageId?: string
    title?: string
    price?: string
    countryCode?: string
  }>()

  const packageId = (Array.isArray(params.packageId) ? params.packageId[0] : params.packageId) ?? ''
  const title = (Array.isArray(params.title) ? params.title[0] : params.title) ?? 'eSIM plan'
  const priceNum = Number((Array.isArray(params.price) ? params.price[0] : params.price) ?? '')
  const countryCode = (Array.isArray(params.countryCode) ? params.countryCode[0] : params.countryCode) ?? ''

  const isWeb = Platform.OS === 'web'
  const walletConnected = isWeb ? !!webWallet.publicKey : !!account

  const usdcLogo = isDarkMode ? USDC_LOGO_URI_DARK : USDC_LOGO_URI_LIGHT

  const priceLabel = useMemo(
    () => (Number.isFinite(priceNum) ? formatPlanDisplayPrice(priceNum, currency) : '—'),
    [priceNum, currency],
  )

  const orderMutation = useMutation({
    mutationFn: () =>
      submitAiraloOrder({
        packageId,
        quantity: 1,
        description: [countryCode, title].filter(Boolean).join(' · '),
      }),
    onSuccess: (data) => {
      const sims = data.data?.sims
      const firstIccid =
        Array.isArray(sims) && sims[0] && typeof sims[0] === 'object' && sims[0] !== null
          ? String((sims[0] as { iccid?: string }).iccid ?? '')
          : ''
      const lines = [
        data.meta?.message ? `API: ${data.meta.message}` : null,
        firstIccid ? `ICCID: ${firstIccid}` : null,
        data.data?.direct_apple_installation_url
          ? `Apple install: ${data.data.direct_apple_installation_url}`
          : null,
      ].filter(Boolean)
      Alert.alert('Order placed', lines.join('\n\n') || 'Check your Airalo dashboard for eSIM details.')
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : 'Order failed'
      Alert.alert('Order failed', msg)
    },
  })

  const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
  const titleC = isDarkMode ? '#ffffff' : '#0f172a'
  const mutedC = isDarkMode ? '#9ca3af' : '#64748b'
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'

  const onConfirm = () => {
    if (!packageId.trim()) {
      Alert.alert('Missing package', 'Go back and choose a plan again.')
      return
    }
    if (currency === 'usdc' && !walletConnected) {
      Alert.alert(
        'Connect Solana wallet',
        'USDC on Solana checkout requires a connected wallet. Connect in Profile, then return here.',
      )
      return
    }
    const message =
      currency === 'usdc'
        ? 'On-chain USDC transfer will be added next; this submits the Airalo order now using your partner balance.'
        : 'This submits the order to Airalo and uses your partner account balance.'
    Alert.alert('Confirm purchase', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Place order',
        style: 'default',
        onPress: () => orderMutation.mutate(),
      },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: cardBorder }]}>
        <Pressable hitSlop={16} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: titleC }]} numberOfLines={1}>
          Checkout
        </Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.planTitle, { color: titleC }]}>{title}</Text>
          {countryCode ? (
            <Text style={[styles.meta, { color: mutedC }]}>{countryCode}</Text>
          ) : null}
          <View style={styles.priceRow}>
            {currency === 'usdc' ? (
              <Image source={{ uri: usdcLogo }} style={styles.usdcInline} contentFit="contain" />
            ) : null}
            <Text style={styles.priceText}>{priceLabel}</Text>
          </View>
        </View>

        {currency === 'usdc' ? (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.sectionLabel, { color: mutedC }]}>Payment</Text>
            <Text style={[styles.body, { color: titleC }]}>
              Pay with USDC on Solana. SPL token transfer to a merchant wallet will complete this flow; for the MVP
              preview, connect your wallet in Profile so we know you are ready for on-chain settlement.
            </Text>
            <View style={styles.walletHint}>
              <Image source={{ uri: usdcLogo }} style={styles.usdcBadge} contentFit="contain" />
              <Text style={[styles.body, { color: walletConnected ? '#34d399' : mutedC }]}>
                {walletConnected
                  ? 'Wallet connected'
                  : 'Wallet not connected — open Profile to connect (web: Phantom).'}
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
            orderMutation.isPending && styles.primaryBtnDisabled,
          ]}
          onPress={onConfirm}
          disabled={orderMutation.isPending}
        >
          {orderMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {currency === 'usdc' ? 'Confirm (place Airalo order)' : 'Place order'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  meta: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  usdcInline: {
    width: 28,
    height: 28,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#a5b4fc',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  walletHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  usdcBadge: {
    width: 36,
    height: 36,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.9,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
})
