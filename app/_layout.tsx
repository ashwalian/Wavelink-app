import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import 'react-native-reanimated'
import { AppProviders } from '@/components/app-providers'
import { ThemedStatusBar } from '@/components/themed-status-bar'

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="profile"
          options={{
            // Web modal stacks often swallow pointer events on the sheet; card keeps taps reliable.
            presentation: Platform.OS === 'web' ? 'card' : 'modal',
          }}
        />
      </Stack>
      <ThemedStatusBar />
    </AppProviders>
  )
}
