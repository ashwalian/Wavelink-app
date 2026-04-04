import { Platform } from 'react-native'
import { AIRALO_PARTNERS_BASE_URL } from '@/lib/airalo/config'

/** Same-origin path — Metro `metro.config.js` may proxy this (not always active on web). */
export const AIRALO_WEB_PROXY_PREFIX = '/airalo-api'

/**
 * Full URL for Airalo API calls.
 * - Web + `EXPO_PUBLIC_AIRALO_DEV_PROXY` → that origin (run `npm run airalo-proxy`).
 * - Web else → `/airalo-api/...` (Metro middleware when it runs).
 * - Native → direct https://partners-api.airalo.com/...
 */
export function buildAiraloRequestUrl(
  path: string,
  query?: Record<string, string | number | undefined | null>,
): string {
  const pathPart = path.startsWith('/') ? path : `/${path}`
  const sp = new URLSearchParams()
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      sp.set(key, String(value))
    }
  }
  const qs = sp.toString()
  const suffix = qs ? `?${qs}` : ''

  if (Platform.OS === 'web') {
    const devProxy = process.env.EXPO_PUBLIC_AIRALO_DEV_PROXY?.trim().replace(/\/$/, '')
    if (devProxy) {
      return `${devProxy}${pathPart}${suffix}`
    }
    return `${AIRALO_WEB_PROXY_PREFIX}${pathPart}${suffix}`
  }

  const base = AIRALO_PARTNERS_BASE_URL.replace(/\/$/, '')
  return `${base}${pathPart}${suffix}`
}
