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

/** POST /v2/orders — response shape varies; narrow in UI as needed. */
export type AiraloSubmitOrderResponse = {
  data?: {
    id?: number
    package_id?: string
    price?: number
    currency?: string
    sims?: unknown[]
    direct_apple_installation_url?: string
    qrcode_installation?: string
    manual_installation?: string
    [key: string]: unknown
  }
  meta?: { message?: string }
}

/** POST /v2/voucher/esim */
export type AiraloEsimVoucherResponse = {
  data?: Array<{
    package_id?: string
    codes?: string[]
    booking_reference?: string
    [key: string]: unknown
  }>
  meta?: { message?: string }
}

/** GET /v2/sims/{iccid}/topups */
export type AiraloSimTopupsResponse = {
  pricing: AiraloPricingBlock
  data: unknown[]
}

/** POST /v2/orders/topups */
export type AiraloTopupOrderResponse = {
  data?: Record<string, unknown>
  meta?: { message?: string }
}

/** GET /v2/orders */
export type AiraloOrdersListResponse = {
  data?: unknown
  links?: AiraloPackagesLinks
  meta?: AiraloPackagesMeta | { message?: string; [key: string]: unknown }
}

/** GET /v2/orders/{order_id} */
export type AiraloOrderDetailResponse = {
  data?: unknown
  meta?: { message?: string }
}

/** POST /v2/cancel-future-orders */
export type AiraloCancelFutureOrdersResponse = {
  data?: string[]
  meta?: { message?: string }
}

export type AiraloFutureOrderRow = {
  request_id: string
  quantity: number
  description: string
  status: string
  package_id: string
  due_date: string
  latest_cancellation_date: string
}

/** GET /v2/future-orders */
export type AiraloFutureOrdersResponse = {
  data?: AiraloFutureOrderRow[]
  links?: AiraloPackagesLinks
  meta?: AiraloPackagesMeta | { message?: string; [key: string]: unknown }
}

/** POST /v2/simulator/webhook */
export type AiraloWebhookSimulatorResponse = {
  success?: string
  [key: string]: unknown
}

/** POST /v2/refund (202) */
export type AiraloRefundRequestResponse = {
  data?: {
    refund_id?: string
    created_at?: string
    [key: string]: unknown
  }
  meta?: { message?: string }
}

/** Documented refund reasons (POST /v2/refund). */
export type AiraloRefundReason =
  | 'INSTALLATION_FAILURE'
  | 'NO_COVERAGE'
  | 'APN_FAILURE'
  | 'TRIP_CANCELLATION'
  | 'INTERMITTENT_CONNECTION'
  | 'BLOCKED_NETWORK'
  | 'CHANGE_OF_PLAN'
  | 'DELETED_ESIM'
  | 'EARLY_EXPIRY'
  | 'HOTSPOT_NOT_WORKING'
  | 'IMSI_CHANGE'
  | 'INCOMPATIBLE_DEVICE'
  | 'LOCKED_DEVICE'
  | 'NO_VOICE_TEXT_SERVICES'
  | 'OVERCHARGED'
  | 'SLOW_SPEED'
  | 'TOP_UP_PACKAGE_FAILURE'
  | 'UNKNOWN_CHARGES'
  | 'WRONG_PURCHASE'
  | 'UNABLE_TO_ACCESS_APPS'
  | 'SERVICE_DEGRADATION'
  | 'QR_ISSUE_PARTNERS'
  | 'OTHERS'
