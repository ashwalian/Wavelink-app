import { AIRALO_PARTNERS_BASE_URL, getAiraloAuthHeaders } from '@/lib/airalo/config'
import { AiraloPartnersApiError } from '@/lib/airalo/errors'

export type AiraloRequestOptions = {
  /** Override bearer token (e.g. tests). */
  accessToken?: string
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Record<string, string | number | undefined | null>): string {
  const base = AIRALO_PARTNERS_BASE_URL.endsWith('/')
    ? AIRALO_PARTNERS_BASE_URL
    : `${AIRALO_PARTNERS_BASE_URL}/`
  const url = new URL(path.replace(/^\//, ''), base)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export async function airaloPartnersGetJson<T>(
  path: string,
  query?: Record<string, string | number | undefined | null>,
  options?: AiraloRequestOptions,
): Promise<T> {
  const url = buildUrl(path, query)
  const res = await fetch(url, {
    method: 'GET',
    headers: getAiraloAuthHeaders(
      options?.accessToken ? { accessToken: options.accessToken } : undefined,
    ),
    signal: options?.signal,
  })

  const bodyText = await res.text()
  if (!res.ok) {
    throw new AiraloPartnersApiError(
      `Airalo Partners API ${res.status}: ${bodyText.slice(0, 200)}`,
      res.status,
      bodyText,
    )
  }

  try {
    return JSON.parse(bodyText) as T
  } catch {
    throw new AiraloPartnersApiError('Invalid JSON in Airalo response', res.status, bodyText)
  }
}
