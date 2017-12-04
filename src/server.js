import api from './api'
import createServer from './lib/createServer'

import {
  serverHost,
  serverPort,
  serverSsl
} from '../universal.config'

let requestListener = api

const server = createServer(serverSsl, (req, res) => {
  requestListener(req, res)
})

server.listen(serverPort, serverHost, () => {
  console.log(`Server listening -- http://${serverHost}:${serverPort}`)
})

if (module.hot) {
  module.hot.accept('./api', () => {
    requestListener = require('./api').default
  })
}

export default server
