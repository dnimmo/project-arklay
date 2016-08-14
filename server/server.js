const express = require('express')
const compression = require('compression')
const path = require('path')
const { readFileSync } = require('fs')
const {
  creditsFileLocation,
  logLocation,
  mapFileLocation,
  itemFileLocation,
  portNumber,
  roomLogFile,
  serverLogFile
} = require('../config/app-config')
const { log } = require('./logging-service/logging-service')(logLocation, serverLogFile)

// Load the map and credits files
const map = JSON.parse(readFileSync(mapFileLocation, 'utf8')).rooms
const items = JSON.parse(readFileSync(itemFileLocation))
const credits = JSON.parse(readFileSync(creditsFileLocation, 'utf8'))

// Instantiate main app
const app = express()

// Serve files
const server = require('http').createServer(app)
const port = portNumber

// GZIP assets
app.use(compression())

// Load endpoints
require('./api/api')(app, map, items, credits, logLocation, roomLogFile)

// Serve client-side files
app.use(express.static(__dirname, path.join('/client')))

server.listen(port, () => {
  log('Server started')
  console.log(`Server listening at port ${port}`)
  console.log('ctrl+c to stop server')
})
