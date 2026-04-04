// @ts-check
const { getDefaultConfig } = require('expo/metro-config')
const https = require('https')

const config = getDefaultConfig(__dirname)
const previousEnhance = config.server?.enhanceMiddleware

/** Forward /airalo-api/* → https://partners-api.airalo.com/* so web dev is same-origin (no CORS). */
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, metroServer) => {
    const chain =
      typeof previousEnhance === 'function' ? previousEnhance(middleware, metroServer) : middleware

    return (req, res, next) => {
      const url = req.url ?? ''
      if (!url.startsWith('/airalo-api')) {
        return chain(req, res, next)
      }

      const path = url.slice('/airalo-api'.length) || '/'

      const options = {
        hostname: 'partners-api.airalo.com',
        port: 443,
        path,
        method: req.method || 'GET',
        headers: { ...req.headers },
      }
      delete options.headers.host
      options.headers.host = 'partners-api.airalo.com'

      const proxyReq = https.request(options, (proxyRes) => {
        res.statusCode = proxyRes.statusCode ?? 502
        const hopByHop = new Set(['connection', 'keep-alive', 'transfer-encoding', 'proxy-connection'])
        for (const [key, value] of Object.entries(proxyRes.headers)) {
          if (!value || hopByHop.has(key.toLowerCase())) continue
          if (Array.isArray(value)) res.setHeader(key, value)
          else res.setHeader(key, value)
        }
        proxyRes.pipe(res)
      })

      proxyReq.on('error', (err) => {
        if (!res.headersSent) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'airalo_proxy',
              message: err instanceof Error ? err.message : String(err),
            }),
          )
        }
      })

      req.pipe(proxyReq)
    }
  },
}

module.exports = config
