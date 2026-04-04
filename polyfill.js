import { Platform } from 'react-native'

if (Platform.OS !== 'web') {
  try {
    const { install } = require('react-native-quick-crypto')
    install()
  } catch (e) {
    console.warn(
      '[polyfill] react-native-quick-crypto could not load. Use a dev client build (`expo run:ios` / `expo run:android`), not Expo Go, if you need Solana crypto.',
      e?.message ?? e,
    )
  }
}
