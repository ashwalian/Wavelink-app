import AsyncStorage from '@react-native-async-storage/async-storage'
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'

const STORAGE_KEY = '@airalo/theme-is-dark'

type ThemePreferenceContextValue = {
  isDarkMode: boolean
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null)

export function ThemePreferenceProvider({ children }: PropsWithChildren) {
  const [isDarkMode, setIsDarkModeState] = useState(true)

  useEffect(() => {
    let cancelled = false
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (cancelled || raw === null) return
      setIsDarkModeState(raw === '1')
    })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((value: boolean) => {
    void AsyncStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  }, [])

  const setDarkMode = useCallback((value: boolean) => {
    setIsDarkModeState(value)
    persist(value)
  }, [persist])

  const toggleDarkMode = useCallback(() => {
    setIsDarkModeState((prev) => {
      const next = !prev
      void AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return
    const bg = isDarkMode ? '#0a0a0a' : '#ffffff'
    document.body.style.backgroundColor = bg
    document.documentElement.style.backgroundColor = bg
  }, [isDarkMode])

  const value = useMemo(
    () => ({ isDarkMode, setDarkMode, toggleDarkMode }),
    [isDarkMode, setDarkMode, toggleDarkMode],
  )

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext)
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider')
  }
  return ctx
}
