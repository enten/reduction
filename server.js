const uconfig = require('./universal.config')

const {
  serverHost,
  serverPort
} = uconfig

let {createServer} = require('http')
let requestHandler = require('./requestHandler')

const server = createServer((req, res) => {
  requestHandler(req, res)
})

server.listen(serverPort, serverHost, () => {
  console.log(`Server listening -- http://${serverHost}:${serverPort}`)
})

module.exports = server

if (module.hot) {
  module.hot.accept('./requestHandler.js', () => {
    requestHandler = require('./requestHandler.js')
  })
}
