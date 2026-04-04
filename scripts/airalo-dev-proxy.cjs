/**
 * Dev-only HTTP proxy: forwards to https://partners-api.airalo.com with CORS headers
 * so the Expo web app (different port) can call the Airalo API.
 *
 * Run: npm run airalo-proxy
 * Set in .env: EXPO_PUBLIC_AIRALO_DEV_PROXY=http://localhost:8787
 */
const http = require('http')
const https = require('https')

const PORT = Number(process.env.AIRALO_PROXY_PORT || 8787)
const UPSTREAM_HOST = 'partners-api.airalo.com'

const hopByHop = new Set(['connection', 'keep-alive', 'transfer-encoding', 'proxy-connection'])

const server = http.createServer((req, res) => {
  const reqOrigin = req.headers.origin
  const allowOrigin = reqOrigin || '*'

  const applyCors = () => {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] ||
        'Authorization, Content-Type, Accept, X-Requested-With',
    )
    res.setHeader('Access-Control-Max-Age', '86400')
  }

  if (req.method === 'OPTIONS') {
    applyCors()
    res.statusCode = 204
    res.end()
    return
  }

  applyCors()

  const pathAndQuery = req.url || '/'
  const headers = { ...req.headers, host: UPSTREAM_HOST }
  delete headers.connection

  const upstream = https.request(
    {
      hostname: UPSTREAM_HOST,
      port: 443,
      path: pathAndQuery,
      method: req.method || 'GET',
      headers,
    },
    (upRes) => {
      res.statusCode = upRes.statusCode || 502
      for (const [key, value] of Object.entries(upRes.headers)) {
        if (value == null || hopByHop.has(key.toLowerCase())) continue
        if (Array.isArray(value)) res.setHeader(key, value)
        else res.setHeader(key, value)
      }
      upRes.pipe(res)
    },
  )

  upstream.on('error', (err) => {
    if (!res.headersSent) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'airalo_dev_proxy', message: err.message }))
    }
  })

  req.pipe(upstream)
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Airalo dev proxy listening on http://localhost:${PORT} → https://${UPSTREAM_HOST}`)
})
