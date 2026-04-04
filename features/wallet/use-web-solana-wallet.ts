import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

const STORAGE_KEY = '@airalo/web-solana-pubkey'

type SolanaInjected = {
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toBase58(): string } }>
  disconnect?: () => Promise<void>
  isConnected?: boolean
  publicKey?: { toBase58(): string } | null
}

function getInjectedSolana(): SolanaInjected | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    solana?: SolanaInjected & { isPhantom?: boolean }
    phantom?: { solana?: SolanaInjected }
  }
  if (w.solana) return w.solana
  return w.phantom?.solana
}

/**
 * Browser extension wallets (e.g. Phantom). Mobile Wallet Adapter `connect()` targets a phone app + websocket, not extensions.
 */
export function useWebSolanaWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [ready, setReady] = useState(Platform.OS !== 'web')

  const refreshFromStorage = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY)
    setPublicKey(stored)
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'web') return
    let cancelled = false
    ;(async () => {
      const injected = getInjectedSolana()
      try {
        if (injected?.isConnected && injected.publicKey) {
          const pk = injected.publicKey.toBase58()
          if (!cancelled) {
            setPublicKey(pk)
            await AsyncStorage.setItem(STORAGE_KEY, pk)
          }
        } else {
          await refreshFromStorage()
        }
      } catch {
        await refreshFromStorage()
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshFromStorage])

  const connect = useCallback(async () => {
    if (Platform.OS !== 'web') return
    const injected = getInjectedSolana()
    if (!injected) {
      throw new Error(
        'No browser wallet found. Install Phantom (or another wallet that injects window.solana) and refresh.',
      )
    }
    const { publicKey: pk } = await injected.connect()
    const base58 = pk.toBase58()
    setPublicKey(base58)
    await AsyncStorage.setItem(STORAGE_KEY, base58)
  }, [])

  const disconnect = useCallback(async () => {
    if (Platform.OS !== 'web') return
    const injected = getInjectedSolana()
    try {
      await injected?.disconnect?.()
    } catch {
      /* wallet may ignore disconnect */
    }
    setPublicKey(null)
    await AsyncStorage.removeItem(STORAGE_KEY)
  }, [])

  return { publicKey, connect, disconnect, ready }
}
