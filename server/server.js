const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const compression = require('compression')
const port = 8080

// Load the map and credits
const map = JSON.parse(fs.readFileSync('./server/game-map/map.json', 'utf8')).rooms
const credits = JSON.parse(fs.readFileSync('./server/credits/credits.json', 'utf8'))

const mapService = require('./game-map/service')(map)

//  GZIP assets
app.use(compression())

// Serve files
app.use(express.static(__dirname + '/build'))

// Serve requested room on /rooms/requested-room-slug
app.get('/rooms/:slug', (request, response) => response.json(mapService.getRoom(request.params.slug)))

// Serve the credits on /credits
app.get('/credits', (request, response) => response.json(credits))

server.listen(port, () => {
	console.log('Server listening at port %d', port)
  console.log('ctrl+c to stop server')
})
