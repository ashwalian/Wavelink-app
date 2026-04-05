import type { AppDisplayCurrency } from '@/features/currency/currency-preference-provider'

/**
 * Airalo catalogue prices are USD; USDC is shown 1:1 for display (stablecoin peg).
 */
export function formatPlanDisplayPrice(price: number, currency: AppDisplayCurrency): string {
  if (!Number.isFinite(price)) return currency === 'usd' ? '—' : '— USDC'
  const fixed = price.toFixed(2)
  if (currency === 'usd') return `$${fixed}`
  return `${fixed} USDC`
}
