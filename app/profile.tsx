import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import MoonIcon from '@/components/icons/MoonIcon';
import BrightnessDownIcon from '@/components/icons/BrightnessDownIcon';
import WalletIcon from '@/components/icons/WalletIcon';
import { USDC_LOGO_URI_DARK, USDC_LOGO_URI_LIGHT } from '@/constants/usdc-assets';
import { useCurrencyPreference } from '@/features/currency/currency-preference-provider';
import { useThemePreference } from '@/features/theme/theme-preference-provider';
import { useWebSolanaWallet } from '@/features/wallet/use-web-solana-wallet';

const appVersion =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '5.37.0';

function shortAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, setDarkMode } = useThemePreference();
  const { currency, setCurrency } = useCurrencyPreference();
  const { account, connect, disconnect } = useMobileWallet();
  const webWallet = useWebSolanaWallet();
  const [walletBusy, setWalletBusy] = useState(false);

  const isWeb = Platform.OS === 'web';
  const walletConnected = isWeb ? !!webWallet.publicKey : !!account;
  const walletSubtitle = (() => {
    if (isWeb) {
      if (webWallet.publicKey) return `Connected · ${shortAddress(webWallet.publicKey)}`;
      return 'Not connected ';
    }
    if (account) return `${account.label ?? 'Connected'} · ${shortAddress(String(account.address))}`;
    return 'Not connected';
  })();

  const onWalletConnect = async () => {
    setWalletBusy(true);
    try {
      if (isWeb) await webWallet.connect();
      else await connect();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not connect';
      Alert.alert('Solana wallet', message);
    } finally {
      setWalletBusy(false);
    }
  };

  const usdcLogoUri = isDarkMode ? USDC_LOGO_URI_DARK : USDC_LOGO_URI_LIGHT;

  const onPickCurrency = () => {
    Alert.alert('Display currency', 'Prices in the catalogue use this unit. USDC follows USD 1:1 for display.', [
      {
        text: 'USD ($)',
        onPress: () => setCurrency('usd'),
      },
      {
        text: 'USDC',
        onPress: () => setCurrency('usdc'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onWalletDisconnect = async () => {
    setWalletBusy(true);
    try {
      if (isWeb) await webWallet.disconnect();
      else await disconnect();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not disconnect';
      Alert.alert('Solana wallet', message);
    } finally {
      setWalletBusy(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }]}
      collapsable={false}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Back button */}
        <View style={styles.header}>
          <Pressable
            hitSlop={20}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={[styles.backButton, { color: isDarkMode ? '#4f46e5' : '#37306d' }]}>← Back</Text>
          </Pressable>
          <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Section 1: Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, !isDarkMode && styles.sectionTitleLight]}>Account</Text>
          <View style={[styles.card, !isDarkMode && styles.lightCard]}>
            <View style={styles.item}>
              <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Account Settings</Text>
            </View>
            <View style={[styles.divider, !isDarkMode && styles.dividerLight]} />
            <View style={styles.item}>
              <View>
                <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Gmail</Text>
                <Text style={[styles.itemSubText, !isDarkMode && styles.itemSubTextLight]}>user@gmail.com</Text>
              </View>
            </View>
            <View style={[styles.divider, !isDarkMode && styles.dividerLight]} />
            <View style={styles.item}>
              <View style={styles.walletRowMain}>
                <WalletIcon
                  size={24}
                  color={isDarkMode ? '#a5b4fc' : '#4f46e5'}
                  strokeWidth={2}
                />
                <View style={styles.itemBody}>
                  <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>
                    Solana wallet
                  </Text>
                  <Text style={[styles.itemSubText, !isDarkMode && styles.itemSubTextLight]}>
                    {walletSubtitle}
                  </Text>
                </View>
              </View>
              {walletConnected ? (
                <Pressable hitSlop={12} disabled={walletBusy} onPress={onWalletDisconnect}>
                  <Text style={styles.disconnectLabel}>Disconnect</Text>
                </Pressable>
              ) : (
                <Pressable hitSlop={12} disabled={walletBusy} onPress={onWalletConnect}>
                  <Text
                    style={[
                      styles.connectLabel,
                      { color: isDarkMode ? '#a5b4fc' : '#4f46e5' },
                    ]}
                  >
                    Connect
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={[styles.divider, !isDarkMode && styles.dividerLight]} />
            <View style={styles.item}>
              <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Purchase History</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
            <View style={[styles.divider, !isDarkMode && styles.dividerLight]} />
            <Pressable style={styles.item} onPress={onPickCurrency} accessibilityRole="button">
              <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Currency</Text>
              <View style={styles.currencyRight}>
                {currency === 'usdc' ? (
                  <>
                    <Image
                      source={{ uri: usdcLogoUri }}
                      style={styles.currencyIcon}
                      contentFit="contain"
                      accessibilityLabel="USDC"
                    />
                    <Text style={[styles.itemSubText, !isDarkMode && styles.itemSubTextLight]}>USDC</Text>
                  </>
                ) : (
                  <Text style={[styles.itemSubText, !isDarkMode && styles.itemSubTextLight]}>USD ($)</Text>
                )}
                <ChevronRightIcon size={18} color="#9ca3af" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section 2: Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, !isDarkMode && styles.sectionTitleLight]}>Info</Text>
          <View style={[styles.card, !isDarkMode && styles.lightCard]}>
            <View style={styles.item}>
              <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Info about Airalo</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
            <View style={[styles.divider, !isDarkMode && styles.dividerLight]} />
            <View style={styles.item}>
              <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Rate this app</Text>
              <ChevronRightIcon size={18} color="#9ca3af" />
            </View>
          </View>
        </View>

        {/* Section 3: Application */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, !isDarkMode && styles.sectionTitleLight]}>Application</Text>
          <View style={[styles.card, !isDarkMode && styles.lightCard]}>
            <View style={styles.item}>
              <View style={styles.appearanceLeft} accessibilityLabel="Appearance">
                {isDarkMode ? (
                  <MoonIcon size={24} color="#4f46e5" />
                ) : (
                  <BrightnessDownIcon size={24} color="#f59e0b" />
                )}
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.itemText, { color: isDarkMode ? '#ffffff' : '#1e293b' }]}>Appearance</Text>
                  <Text style={[styles.itemSubText, !isDarkMode && styles.itemSubTextLight]}>
                    {isDarkMode ? 'Dark' : 'Light'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#d1d5db"
                style={Platform.OS === 'web' ? styles.switchWeb : undefined}
              />
            </View>
          </View>
          <Text style={[styles.versionText, { color: isDarkMode ? '#6b7280' : '#94a3b8' }]}>Version {appVersion}</Text>
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
    backgroundColor: '#ffffff',
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
    color: '#4f46e5',
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
  sectionTitleLight: {
    color: '#64748b',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  lightCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
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
  itemBody: {
    flex: 1,
    marginRight: 12,
  },
  walletRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 12,
  },
  appearanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  switchWeb: {
    transform: [{ scaleX: 1.05 }, { scaleY: 1.05 }],
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
  itemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  lightText: {
    color: '#1e293b',
  },
  itemSubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  itemSubTextLight: {
    color: '#64748b',
  },
  connectLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  disconnectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f87171',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
  dividerLight: {
    backgroundColor: '#e2e8f0',
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyIcon: {
    width: 24,
    height: 24,
  },
});
