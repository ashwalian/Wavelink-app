import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { NetworkProvider } from '@/features/network/network-provider'
import { MobileWalletProvider } from '@wallet-ui/react-native-kit'
import { AppConfig } from '@/constants/app-config'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { CurrencyPreferenceProvider } from '@/features/currency/currency-preference-provider'
import { ThemePreferenceProvider } from '@/features/theme/theme-preference-provider'

const queryClient = new QueryClient()
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider
          networks={AppConfig.networks}
          render={({ selectedNetwork }) => (
            <MobileWalletProvider cluster={selectedNetwork} identity={AppConfig.identity}>
              <ThemePreferenceProvider>
                <CurrencyPreferenceProvider>{children}</CurrencyPreferenceProvider>
              </ThemePreferenceProvider>
            </MobileWalletProvider>
          )}
        />
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
