/**
 * Airalo Partners API base URL (no trailing slash).
 * @see https://developers.partners.airalo.com/
 */
export const AIRALO_PARTNERS_BASE_URL = (
  process.env.EXPO_PUBLIC_AIRALO_API_BASE_URL ?? 'https://partners-api.airalo.com'
).replace(/\/$/, '')

export async function getAiraloAuthHeaders(overrides?: { accessToken?: string }): Promise<HeadersInit> {
  const { resolveAiraloAccessToken } = await import('@/lib/airalo/token')
  const token = overrides?.accessToken ?? (await resolveAiraloAccessToken())
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
