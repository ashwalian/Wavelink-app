/**
 * Loose types for Partners API JSON. Narrow in UI as needed.
 * @see Airalo Partners API docs — GET /v2/packages, /v2/sims, etc.
 */

export type AiraloPricingBlock = {
  model: string
  discount_percentage: number
}

export type AiraloPackagesLinks = {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export type AiraloPackagesMeta = {
  message: string
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: string
  to: number
  total: number
}

/** Successful list response for GET /v2/packages (shape varies slightly with pagination). */
export type AiraloPackagesResponse = {
  pricing: AiraloPricingBlock
  data: unknown[]
  links: AiraloPackagesLinks
  meta: AiraloPackagesMeta
}

export type AiraloSimsResponse = {
  data?: unknown
  meta?: { message?: string }
  [key: string]: unknown
}

export type AiraloSimPackagesResponse = {
  data: unknown[]
}

export type AiraloSimUsageData = {
  remaining: number
  total: number
  expired_at: string
  is_unlimited: boolean
  status: string
  remaining_voice: number
  remaining_text: number
  total_voice: number
  total_text: number
}

export type AiraloSimUsageResponse = {
  data: AiraloSimUsageData
  meta: { message: string }
}
