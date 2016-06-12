// ============
// Server stuff
// ============

const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const compression = require('compression')
const port = process.env.PORT || 80

// Load the map and credits
const data = JSON.parse(fs.readFileSync('src/assets/resources/map.json', 'utf8'))
const credits = JSON.parse(fs.readFileSync('src/assets/resources/credits.json', 'utf8'))

//  GZIP assets
app.use(compression())

// Serve files
app.use(express.static(__dirname + '/build'))
app.get('/rooms/:slug', function(request, response){
  // Get the slug of the room we're moving to
  for (var i = 0; i < data.rooms.length; i+=1){        
    // Return the correct room  
    if(data.rooms[i].slug === request.params.slug){
      response.json(data.rooms[i])
      return
    }
  }
})

// Serve the credits
app.get('/credits', function(request, response){
  response.json(credits)
})

server.listen(port, function(){
	console.log('Server listening at port %d', port)
})
