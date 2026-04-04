/** Single purchasable plan under an operator (GET /v2/packages). */
export type AiraloCatalogSimPackage = {
  id: string
  type?: string
  price: number
  net_price?: number
  amount: number
  day: number
  is_unlimited: boolean
  title: string
  short_info?: string | null
  data?: string
  is_fair_usage_policy?: boolean
  fair_usage_policy?: string | null
}

export type AiraloCatalogOperator = {
  id: number
  title: string
  type: string
  plan_type?: string
  esim_type?: string
  rechargeability?: boolean
  packages: AiraloCatalogSimPackage[]
  info?: string[]
  other_info?: string | null
}

/** One country row in GET /v2/packages `data[]` (local filter). */
export type AiraloCatalogCountry = {
  slug: string
  country_code: string
  title: string
  image: { url: string; width?: number; height?: number }
  operators: AiraloCatalogOperator[]
}

export function isAiraloCatalogCountry(x: unknown): x is AiraloCatalogCountry {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.slug === 'string' &&
    typeof o.country_code === 'string' &&
    typeof o.title === 'string' &&
    o.image != null &&
    typeof o.image === 'object' &&
    typeof (o.image as { url?: string }).url === 'string' &&
    Array.isArray(o.operators)
  )
}
