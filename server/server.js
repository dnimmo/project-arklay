const express = require('express')
const compression = require('compression')
const cors = require('cors')
const { readFileSync } = require('fs')
const {
  creditsFileLocation,
  mapFileLocation,
  itemFileLocation,
  portNumber
} = require('../config/app-config')

// Load the map and credits files
const map = JSON.parse(readFileSync(mapFileLocation, 'utf8')).rooms
const items = JSON.parse(readFileSync(itemFileLocation)).items
const credits = JSON.parse(readFileSync(creditsFileLocation, 'utf8'))

// Instantiate main app
const app = express()
app.use(cors())

// Prevent caching of responses
app.use((request, response, next) => {
  response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  response.header('Expires', '-1');
  response.header('Pragma', 'no-cache');
  next()
})

// Serve files
const server = require('http').createServer(app)
const port = process.env.PORT || portNumber

// GZIP assets
app.use(compression())

// Load endpoints
require('./api/api')(app, map, items, credits)

server.listen(port, () => {
  console.log(`Server listening at port ${port}`)
  console.log('ctrl+c to stop server')
})
