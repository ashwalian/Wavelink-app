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

/** GET /v2/balance — shape may vary; docs: empty accounts when none. */
export type AiraloBalanceResponse = {
  data: {
    balances?: unknown
    accounts?: unknown[]
    [key: string]: unknown
  }
  meta: { message: string }
}

/** GET /v2/notifications/opt-in — which webhook types you are opted into. */
export type AiraloWebhookNotificationType =
  | 'webhook_low_data'
  | 'webhook_credit_limit'
  | 'async_orders'

export type AiraloNotificationsOptInResponse = {
  data: {
    notification: {
      type: AiraloWebhookNotificationType
      contact_point: string
    }
  }
  meta: { message: string }
}

/** Example async-order webhook POST body (partial). */
export type AiraloAsyncOrderWebhookPayload = {
  request_id?: string
  reason?: string
  sims?: unknown
  [key: string]: unknown
}

/** Example low-data webhook POST body (partial). */
export type AiraloLowDataWebhookPayload = {
  level?: '1days' | '3days' | '75%' | '90%'
  package_name?: string
  remaining_percentage?: number
  iccid?: string
  [key: string]: unknown
}

/** Example credit-limit webhook POST body (partial). */
export type AiraloCreditLimitWebhookPayload = {
  message?: string
  remaining?: number
  [key: string]: unknown
}
