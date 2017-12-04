import http from 'http'
import https from 'https'

export default function createServer (tlsOptions, requestListener) {
  if (typeof tlsOptions === 'function') {
    requestListener = tlsOptions
    tlsOptions = undefined
  }

  let server

  if (tlsOptions) {
    server = https.createServer(tlsOptions, requestListener)
  } else {
    server = http.createServer(requestListener)
  }

  return server
}
