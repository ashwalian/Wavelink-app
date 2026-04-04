import { getAiraloAuthHeaders } from '@/lib/airalo/config'
import { AiraloPartnersApiError } from '@/lib/airalo/errors'
import { buildAiraloRequestUrl } from '@/lib/airalo/request-url'

export type AiraloRequestOptions = {
  /** Override bearer token (e.g. tests). */
  accessToken?: string
  signal?: AbortSignal
}

export async function airaloPartnersGetJson<T>(
  path: string,
  query?: Record<string, string | number | undefined | null>,
  options?: AiraloRequestOptions,
): Promise<T> {
  const url = buildAiraloRequestUrl(path, query)
  const headers = await getAiraloAuthHeaders(
    options?.accessToken ? { accessToken: options.accessToken } : undefined,
  )

  const res = await fetch(url, {
    method: 'GET',
    headers,
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
