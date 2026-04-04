import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Same as `verifyAiraloWebhookSignature` but for **Node.js** servers (Express, Next route handlers, etc.).
 * Import this file only from server code — do not import from the Expo app entry (Metro may not resolve `node:crypto`).
 */
export function verifyAiraloWebhookSignatureNode(
  rawBody: string,
  airaloSignatureHeader: string,
  apiSecret: string,
): boolean {
  const expected = createHmac('sha512', apiSecret).update(rawBody, 'utf8').digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(airaloSignatureHeader.trim(), 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
