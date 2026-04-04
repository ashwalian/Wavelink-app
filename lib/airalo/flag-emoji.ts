/** Regional-indicator pair → flag emoji from ISO 3166-1 alpha-2. */
export function countryCodeToFlagEmoji(code: string): string {
  const c = code.trim().toUpperCase()
  if (c.length !== 2 || !/^[A-Z]{2}$/.test(c)) return '🌍'
  const BASE = 0x1f1e6
  return String.fromCodePoint(BASE + c.charCodeAt(0) - 65, BASE + c.charCodeAt(1) - 65)
}

export function formatDataAmountMb(mb: number, isUnlimited: boolean): string {
  if (isUnlimited) return 'Unlimited'
  if (mb >= 1024) return `${(mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1)} GB`
  return `${mb} MB`
}
