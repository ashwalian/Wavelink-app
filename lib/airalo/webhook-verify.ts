import { Platform } from 'react-native'

/**
 * Verify `airalo-signature` header (HMAC-SHA512 hex) for an incoming webhook body.
 * Native-only (uses react-native-quick-crypto). On web, use `webhook-verify-node` on your server.
 */
export function verifyAiraloWebhookSignature(
  rawBody: string,
  airaloSignatureHeader: string,
  apiSecret: string,
): boolean {
  if (Platform.OS === 'web') {
    throw new Error(
      'verifyAiraloWebhookSignature is not supported on web. Verify on your backend with lib/airalo/webhook-verify-node.ts',
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const QuickCrypto = require('react-native-quick-crypto').default
  const expected = QuickCrypto.createHmac('sha512', apiSecret)
    .update(rawBody, 'utf8')
    .digest('hex')
  return timingSafeEqualHex(expected, airaloSignatureHeader.trim())
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const normA = a.toLowerCase()
  const normB = b.toLowerCase()
  if (normA.length !== normB.length) return false
  let diff = 0
  for (let i = 0; i < normA.length; i++) {
    diff |= normA.charCodeAt(i) ^ normB.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Serialize a parsed object to a JSON string for signing, matching typical webhook raw bodies.
 * If you already have the raw request string, pass that to `verifyAiraloWebhookSignature` instead.
 */
export function airaloWebhookPayloadToSignedString(payload: unknown): string {
  if (typeof payload === 'string') return payload
  return JSON.stringify(payload)
}
