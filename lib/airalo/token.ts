import { AiraloPartnersApiError } from '@/lib/airalo/errors'
import { buildAiraloRequestUrl } from '@/lib/airalo/request-url'

type TokenResponse = {
  data: {
    token_type: string
    expires_in: number
    access_token: string
  }
  meta: { message: string }
}

let memoryCache: { token: string; expiresAtMs: number } | null = null

/**
 * Returns a valid Bearer token: uses EXPO_PUBLIC_AIRALO_ACCESS_TOKEN if set,
 * otherwise exchanges EXPO_PUBLIC_AIRALO_CLIENT_ID + EXPO_PUBLIC_AIRALO_CLIENT_SECRET
 * via POST /v2/token (cached until ~1 min before expiry).
 *
 * ⚠️ Never ship client_secret in a public app build — use only for local dev or a backend.
 */
export async function resolveAiraloAccessToken(): Promise<string> {
  const staticToken = process.env.EXPO_PUBLIC_AIRALO_ACCESS_TOKEN?.trim()
  if (staticToken) return staticToken

  const clientId = process.env.EXPO_PUBLIC_AIRALO_CLIENT_ID?.trim()
  const clientSecret = process.env.EXPO_PUBLIC_AIRALO_CLIENT_SECRET?.trim()

  if (!clientId || !clientSecret) {
    throw new Error(
      'Airalo auth: set EXPO_PUBLIC_AIRALO_ACCESS_TOKEN, or EXPO_PUBLIC_AIRALO_CLIENT_ID + EXPO_PUBLIC_AIRALO_CLIENT_SECRET in .env',
    )
  }

  const skewMs = 60_000
  if (memoryCache && Date.now() < memoryCache.expiresAtMs - skewMs) {
    return memoryCache.token
  }

  const form = new FormData()
  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('grant_type', 'client_credentials')

  const url = buildAiraloRequestUrl('/v2/token')
  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: form,
  })

  const bodyText = await res.text()
  if (!res.ok) {
    throw new AiraloPartnersApiError(
      `Airalo token ${res.status}: ${bodyText.slice(0, 300)}`,
      res.status,
      bodyText,
    )
  }

  let parsed: TokenResponse
  try {
    parsed = JSON.parse(bodyText) as TokenResponse
  } catch {
    throw new AiraloPartnersApiError('Invalid JSON from /v2/token', res.status, bodyText)
  }

  const token = parsed.data?.access_token
  if (!token) {
    throw new AiraloPartnersApiError('No access_token in token response', res.status, bodyText)
  }

  const expiresInSec = Number(parsed.data.expires_in) || 86_400
  memoryCache = {
    token,
    expiresAtMs: Date.now() + Math.max(300, expiresInSec) * 1000,
  }
  return token
}

/** For tests or after logout — clears cached OAuth token. */
export function clearAiraloTokenCache(): void {
  memoryCache = null
}
