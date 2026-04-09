import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BellIcon from '@/components/icons/BellIcon';
import UserIcon from '@/components/icons/UserIcon';
import { useThemePreference } from '@/features/theme/theme-preference-provider';

export function Header() {
  const router = useRouter();
  const { isDarkMode } = useThemePreference();
  const fg = isDarkMode ? '#ffffff' : '#0f172a';
  const border = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)';
  const iconBg = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }]}>
      <View style={[styles.container, { borderBottomColor: border }]}>
        <Text style={[styles.logo, { color: fg }]}>Wavelink</Text>
        <View style={styles.icons}>
          <Pressable style={[styles.iconButton, { backgroundColor: iconBg }]}>
            <BellIcon size={24} color={fg} />
          </Pressable>
          <Pressable
            style={[styles.iconButton, { backgroundColor: iconBg }]}
            onPress={() => router.push('/profile')}
            accessibilityLabel="Open profile"
            accessibilityRole="button"
          >
            <UserIcon size={24} color={fg} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
