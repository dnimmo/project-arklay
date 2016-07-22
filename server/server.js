const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const compression = require('compression')
const port = 8080

// Load the map and credits
const map = JSON.parse(fs.readFileSync('src/assets/resources/map.json', 'utf8')).rooms
const credits = JSON.parse(fs.readFileSync('src/assets/resources/credits.json', 'utf8'))

const mapService = require('./game-map/service')(map)

//  GZIP assets
app.use(compression())

// Serve files
app.use(express.static(__dirname + '/build'))
app.get('/rooms/:slug', function(request, response){
  // Get the slug of the requested room
  return response.json(mapService.getRoom(request.params.slug))
})

// Serve the credits
app.get('/credits', function(request, response){
  response.json(credits)
})

server.listen(port, function(){
	console.log('Server listening at port %d', port)
  console.log('ctrl+c to stop server')
})
