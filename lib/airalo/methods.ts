import { airaloPartnersGetJson, type AiraloRequestOptions } from '@/lib/airalo/fetch-json'
import type {
  AiraloBalanceResponse,
  AiraloNotificationsOptInResponse,
  AiraloPackagesResponse,
  AiraloSimPackagesResponse,
  AiraloSimsResponse,
  AiraloSimUsageResponse,
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
