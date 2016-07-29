const express = require('express')
const compression = require('compression')
const { readFileSync } = require('fs')

// Load the map and credits files
const map = JSON.parse(readFileSync('./server/game-map/map.json', 'utf8')).rooms
const credits = JSON.parse(readFileSync('./server/credits/credits.json', 'utf8'))

// Instantiate main app and sub apps
const app = express()

// Serve files
const server = require('http').createServer(app)
const port = 8080

//  GZIP assets
app.use(compression())

// Load endpoints
require('./api/api')(app, map, credits)

// Serve from /build
// app.use(express.static(__dirname, path.join('/build')))

server.listen(port, () => {
  console.log('Server listening at port %d', port)
  console.log('ctrl+c to stop server')
})
