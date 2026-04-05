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

/**
 * POST JSON (Content-Type: application/json).
 */
export async function airaloPartnersPostJson<T>(
  path: string,
  body: unknown,
  options?: AiraloRequestOptions,
): Promise<T> {
  const url = buildAiraloRequestUrl(path)
  const auth = await getAiraloAuthHeaders(
    options?.accessToken ? { accessToken: options.accessToken } : undefined,
  )

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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

export type AiraloFormFieldValue = string | string[]

/**
 * POST multipart/form-data (e.g. POST /v2/orders). Do not set Content-Type — the runtime sets the boundary.
 */
export async function airaloPartnersPostFormData<T>(
  path: string,
  fields: Record<string, AiraloFormFieldValue | undefined>,
  options?: AiraloRequestOptions,
): Promise<T> {
  const url = buildAiraloRequestUrl(path)
  const headers = await getAiraloAuthHeaders(
    options?.accessToken ? { accessToken: options.accessToken } : undefined,
  )

  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        form.append(key, item)
      }
    } else {
      form.append(key, value)
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
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
