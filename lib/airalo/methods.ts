import {
  airaloPartnersGetJson,
  airaloPartnersPostFormData,
  airaloPartnersPostJson,
  type AiraloRequestOptions,
} from '@/lib/airalo/fetch-json'
import type {
  AiraloBalanceResponse,
  AiraloCancelFutureOrdersResponse,
  AiraloEsimVoucherResponse,
  AiraloFutureOrdersResponse,
  AiraloNotificationsOptInResponse,
  AiraloOrderDetailResponse,
  AiraloOrdersListResponse,
  AiraloPackagesResponse,
  AiraloRefundReason,
  AiraloRefundRequestResponse,
  AiraloCompatibleDevicesLiteResponse,
  AiraloSimPackagesResponse,
  AiraloSimTopupsResponse,
  AiraloSimsResponse,
  AiraloSimUsageResponse,
  AiraloSubmitOrderResponse,
  AiraloTopupOrderResponse,
  AiraloWebhookSimulatorResponse,
} from '@/lib/airalo/types'

export type GetPackagesParams = {
  /** `"local"` | `"global"` — omit for all types */
  filterType?: 'local' | 'global'
  /** ISO-style country code, e.g. US, DE, TR */
  filterCountry?: string
  limit?: number
  page?: number
  /** Pass `"topup"` to include top-up packages */
  include?: 'topup'
}

/**
 * GET /v2/packages
 * List local/global eSIM packages. Omit `limit` for full catalogue (~3.2k) per docs.
 */
export function getAiraloPackages(
  params: GetPackagesParams = {},
  options?: AiraloRequestOptions,
): Promise<AiraloPackagesResponse> {
  return airaloPartnersGetJson<AiraloPackagesResponse>(
    '/v2/packages',
    {
      'filter[type]': params.filterType,
      'filter[country]': params.filterCountry,
      limit: params.limit,
      page: params.page,
      include: params.include,
    },
    options,
  )
}

export type GetSimsParams = {
  /** e.g. `order,order.status,order.user,share` */
  include?: string
  /** e.g. `Y-m-d - Y-m-d` */
  filterCreatedAt?: string
  filterIccid?: string
  limit?: number
  page?: number
}

/**
 * GET /v2/sims
 * List purchased eSIMs (ICCID is your primary key for customer mapping).
 */
export function getAiraloSims(
  params: GetSimsParams = {},
  options?: AiraloRequestOptions,
): Promise<AiraloSimsResponse> {
  return airaloPartnersGetJson<AiraloSimsResponse>(
    '/v2/sims',
    {
      include: params.include,
      'filter[created_at]': params.filterCreatedAt,
      'filter[iccid]': params.filterIccid,
      limit: params.limit,
      page: params.page,
    },
    options,
  )
}

/**
 * GET /v2/sims/{iccid}/packages
 * Package / top-up history for one eSIM. Rate limit: ~1 request / 15 min — cache responses.
 */
export function getAiraloSimPackageHistory(
  iccid: string,
  options?: AiraloRequestOptions,
): Promise<AiraloSimPackagesResponse> {
  const trimmed = iccid.trim()
  if (!trimmed) throw new Error('iccid is required')
  return airaloPartnersGetJson<AiraloSimPackagesResponse>(
    `/v2/sims/${encodeURIComponent(trimmed)}/packages`,
    undefined,
    options,
  )
}

/**
 * GET /v2/sims/{sim_iccid}/usage
 * Data / voice / text usage. Rate limit: 100 req/min per ICCID; ~20 min cache server-side.
 */
export function getAiraloSimUsage(
  simIccid: string,
  options?: AiraloRequestOptions,
): Promise<AiraloSimUsageResponse> {
  const trimmed = simIccid.trim()
  if (!trimmed) throw new Error('simIccid is required')
  return airaloPartnersGetJson<AiraloSimUsageResponse>(
    `/v2/sims/${encodeURIComponent(trimmed)}/usage`,
    undefined,
    options,
  )
}

/**
 * GET /v2/balance
 * Account balance / credit overview. If there is no account, `accounts` may be an empty array per docs.
 */
export function getAiraloBalance(
  options?: AiraloRequestOptions,
): Promise<AiraloBalanceResponse> {
  return airaloPartnersGetJson<AiraloBalanceResponse>('/v2/balance', undefined, options)
}

/**
 * GET /v2/notifications/opt-in
 * Current webhook opt-in details (low data, credit limit, or async orders — same path; response reflects your registration).
 */
export function getAiraloNotificationsOptIn(
  options?: AiraloRequestOptions,
): Promise<AiraloNotificationsOptInResponse> {
  return airaloPartnersGetJson<AiraloNotificationsOptInResponse>(
    '/v2/notifications/opt-in',
    undefined,
    options,
  )
}

export type AiraloEsimVoucherItem = {
  package_id: string
  quantity: number
  booking_reference?: string
}

/**
 * POST /v2/voucher/esim (application/json)
 */
export function createAiraloEsimVouchers(
  vouchers: AiraloEsimVoucherItem[],
  options?: AiraloRequestOptions,
): Promise<AiraloEsimVoucherResponse> {
  if (!vouchers.length) throw new Error('vouchers must be a non-empty array')
  return airaloPartnersPostJson<AiraloEsimVoucherResponse>(
    '/v2/voucher/esim',
    { vouchers },
    options,
  )
}

/**
 * GET /v2/sims/{iccid}/topups
 */
export function getAiraloSimTopups(
  iccid: string,
  options?: AiraloRequestOptions,
): Promise<AiraloSimTopupsResponse> {
  const trimmed = iccid.trim()
  if (!trimmed) throw new Error('iccid is required')
  return airaloPartnersGetJson<AiraloSimTopupsResponse>(
    `/v2/sims/${encodeURIComponent(trimmed)}/topups`,
    undefined,
    options,
  )
}

export type SubmitAiraloTopupOrderParams = {
  packageId: string
  iccid: string
  description?: string
}

/**
 * POST /v2/orders/topups (multipart/form-data)
 */
export function submitAiraloTopupOrder(
  params: SubmitAiraloTopupOrderParams,
  options?: AiraloRequestOptions,
): Promise<AiraloTopupOrderResponse> {
  const packageId = params.packageId.trim()
  const iccid = params.iccid.trim()
  if (!packageId) throw new Error('packageId is required')
  if (!iccid) throw new Error('iccid is required')
  return airaloPartnersPostFormData<AiraloTopupOrderResponse>(
    '/v2/orders/topups',
    {
      package_id: packageId,
      iccid,
      ...(params.description ? { description: params.description } : {}),
    },
    options,
  )
}

export type GetAiraloOrdersParams = {
  include?: string
  filterCreatedAt?: string
  filterCode?: string
  filterOrderStatus?: string
  filterIccid?: string
  filterDescription?: string
  limit?: number
  page?: number
}

/**
 * GET /v2/orders
 */
export function getAiraloOrders(
  params: GetAiraloOrdersParams = {},
  options?: AiraloRequestOptions,
): Promise<AiraloOrdersListResponse> {
  return airaloPartnersGetJson<AiraloOrdersListResponse>(
    '/v2/orders',
    {
      include: params.include,
      'filter[created_at]': params.filterCreatedAt,
      'filter[code]': params.filterCode,
      'filter[order_status]': params.filterOrderStatus,
      'filter[iccid]': params.filterIccid,
      'filter[description]': params.filterDescription,
      limit: params.limit,
      page: params.page,
    },
    options,
  )
}

export type GetAiraloOrderParams = {
  include?: string
}

/**
 * GET /v2/orders/{order_id}
 */
export function getAiraloOrder(
  orderId: string,
  params: GetAiraloOrderParams = {},
  options?: AiraloRequestOptions,
): Promise<AiraloOrderDetailResponse> {
  const id = orderId.trim()
  if (!id) throw new Error('orderId is required')
  return airaloPartnersGetJson<AiraloOrderDetailResponse>(
    `/v2/orders/${encodeURIComponent(id)}`,
    { include: params.include },
    options,
  )
}

/**
 * POST /v2/cancel-future-orders (application/json)
 */
export function cancelAiraloFutureOrders(
  requestIds: string[],
  options?: AiraloRequestOptions,
): Promise<AiraloCancelFutureOrdersResponse> {
  if (!requestIds.length) throw new Error('requestIds must be a non-empty array')
  if (requestIds.length > 10) throw new Error('requestIds: maximum 10 per request')
  return airaloPartnersPostJson<AiraloCancelFutureOrdersResponse>(
    '/v2/cancel-future-orders',
    { request_ids: requestIds },
    options,
  )
}

export type GetAiraloFutureOrdersParams = {
  status?: string
  limit?: number
  fromDueDate?: string
  toDueDate?: string
  page?: number
}

/**
 * GET /v2/future-orders
 */
export function getAiraloFutureOrders(
  params: GetAiraloFutureOrdersParams = {},
  options?: AiraloRequestOptions,
): Promise<AiraloFutureOrdersResponse> {
  return airaloPartnersGetJson<AiraloFutureOrdersResponse>(
    '/v2/future-orders',
    {
      status: params.status,
      limit: params.limit,
      from_due_date: params.fromDueDate,
      to_due_date: params.toDueDate,
      page: params.page,
    },
    options,
  )
}

/**
 * GET /v2/compatible-devices-lite
 * Lightweight list to validate eSIM-capable devices.
 */
export function getAiraloCompatibleDevicesLite(
  options?: AiraloRequestOptions,
): Promise<AiraloCompatibleDevicesLiteResponse> {
  return airaloPartnersGetJson<AiraloCompatibleDevicesLiteResponse>(
    '/v2/compatible-devices-lite',
    undefined,
    options,
  )
}

export type SimulateAiraloWebhookParams = {
  event: string
  type: string
  iccid?: string
}

/**
 * POST /v2/simulator/webhook (application/json)
 */
export function simulateAiraloWebhook(
  params: SimulateAiraloWebhookParams,
  options?: AiraloRequestOptions,
): Promise<AiraloWebhookSimulatorResponse> {
  const body: Record<string, string> = {
    event: params.event,
    type: params.type,
  }
  if (params.iccid !== undefined) body.iccid = params.iccid
  return airaloPartnersPostJson<AiraloWebhookSimulatorResponse>(
    '/v2/simulator/webhook',
    body,
    options,
  )
}

export type RequestAiraloRefundParams = {
  iccids: string[]
  /** Use a documented reason code where possible; see `AiraloRefundReason`. */
  reason: AiraloRefundReason | string
  notes?: string
  email?: string
}

/**
 * POST /v2/refund (application/json). Docs sample used text/plain; JSON is equivalent for typical gateways.
 * Max 5 ICCIDs per docs.
 */
export function requestAiraloRefund(
  params: RequestAiraloRefundParams,
  options?: AiraloRequestOptions,
): Promise<AiraloRefundRequestResponse> {
  const iccids = params.iccids.map((s) => s.trim()).filter(Boolean)
  if (!iccids.length) throw new Error('iccids must be a non-empty array')
  if (iccids.length > 5) throw new Error('iccids: maximum 5 per request')
  const body: Record<string, unknown> = {
    iccids,
    reason: params.reason,
  }
  if (params.notes !== undefined) body.notes = params.notes
  if (params.email !== undefined) body.email = params.email
  return airaloPartnersPostJson<AiraloRefundRequestResponse>('/v2/refund', body, options)
}

export type SubmitAiraloOrderParams = {
  packageId: string
  /** 1–50; default 1 */
  quantity?: number
  description?: string
}

/**
 * POST /v2/orders (multipart/form-data). Charges your Airalo partner balance.
 * @see https://developers.partners.airalo.com/submit-order-11883024e0
 */
export function submitAiraloOrder(
  params: SubmitAiraloOrderParams,
  options?: AiraloRequestOptions,
): Promise<AiraloSubmitOrderResponse> {
  const trimmed = params.packageId.trim()
  if (!trimmed) throw new Error('packageId is required')
  const qty = Math.min(50, Math.max(1, Math.floor(params.quantity ?? 1)))
  return airaloPartnersPostFormData<AiraloSubmitOrderResponse>(
    '/v2/orders',
    {
      quantity: String(qty),
      package_id: trimmed,
      type: 'sim',
      ...(params.description ? { description: params.description } : {}),
    },
    options,
  )
}
