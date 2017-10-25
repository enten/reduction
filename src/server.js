import api from './api'
import createHttpServer from './lib/createHttpServer'
import uconfig from '../universal.config'

const {
  serverHost,
  serverPort,
  serverSsl
} = uconfig

let handleRequest = api
process.on('unhandledRejection', console.error)
const server = createHttpServer(serverSsl, (req, res) => {
  handleRequest(req, res)
})

server.listen(serverPort, serverHost, () => {
  console.log(`Server listening -- http://${serverHost}:${serverPort}`)
})

if (module.hot) {
  module.hot.accept('./api', () => {
    handleRequest = require('./api').default
  })
}

export default server
