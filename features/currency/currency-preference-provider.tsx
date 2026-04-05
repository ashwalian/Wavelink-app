import AsyncStorage from '@react-native-async-storage/async-storage'
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = '@airalo/display-currency'

export type AppDisplayCurrency = 'usd' | 'usdc'

type CurrencyPreferenceContextValue = {
  currency: AppDisplayCurrency
  setCurrency: (value: AppDisplayCurrency) => void
}

const CurrencyPreferenceContext = createContext<CurrencyPreferenceContextValue | null>(null)

function parseStored(raw: string | null): AppDisplayCurrency {
  if (raw === 'usdc') return 'usdc'
  return 'usd'
}

export function CurrencyPreferenceProvider({ children }: PropsWithChildren) {
  const [currency, setCurrencyState] = useState<AppDisplayCurrency>('usd')

  useEffect(() => {
    let cancelled = false
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (cancelled || raw === null) return
      setCurrencyState(parseStored(raw))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((value: AppDisplayCurrency) => {
    void AsyncStorage.setItem(STORAGE_KEY, value)
  }, [])

  const setCurrency = useCallback(
    (value: AppDisplayCurrency) => {
      setCurrencyState(value)
      persist(value)
    },
    [persist],
  )

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency])

  return <CurrencyPreferenceContext.Provider value={value}>{children}</CurrencyPreferenceContext.Provider>
}

export function useCurrencyPreference(): CurrencyPreferenceContextValue {
  const ctx = useContext(CurrencyPreferenceContext)
  if (!ctx) {
    throw new Error('useCurrencyPreference must be used within CurrencyPreferenceProvider')
  }
  return ctx
}
