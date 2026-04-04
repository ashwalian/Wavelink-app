/**
 * Airalo Partners API base URL (no trailing slash).
 * @see https://developers.partners.airalo.com/
 */
export const AIRALO_PARTNERS_BASE_URL = (
  process.env.EXPO_PUBLIC_AIRALO_API_BASE_URL ?? 'https://partners-api.airalo.com'
).replace(/\/$/, '')

/**
 * OAuth access token from the Partners "Request access token" flow.
 * Dev-only in client: prefer a backend proxy in production (token must not ship in public bundles).
 */
export function getAiraloAccessToken(): string {
  const token = process.env.EXPO_PUBLIC_AIRALO_ACCESS_TOKEN?.trim()
  if (!token) {
    throw new Error(
      'Missing EXPO_PUBLIC_AIRALO_ACCESS_TOKEN. Copy .env.example to .env and set your bearer token.',
    )
  }
  return token
}

export function getAiraloAuthHeaders(overrides?: { accessToken?: string }): HeadersInit {
  const token = overrides?.accessToken ?? getAiraloAccessToken()
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
