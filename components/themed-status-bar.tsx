import { StatusBar } from 'expo-status-bar'
import { useThemePreference } from '@/features/theme/theme-preference-provider'

export function ThemedStatusBar() {
  const { isDarkMode } = useThemePreference()
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} />
}
