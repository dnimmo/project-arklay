const API = (app) => {
  const fs = require('fs')
  // Load the map and credits files, along with the map service
  const map = JSON.parse(fs.readFileSync('./server/game-map/map.json', 'utf8')).rooms
  const credits = JSON.parse(fs.readFileSync('./server/credits/credits.json', 'utf8'))
  const mapService = require('../game-map/service')(map)

  const apiFunctions = () => {
    // Serve requested room on /rooms/requested-room-slug
    app.get('/rooms/:slug', (request, response) => response.json(mapService.getRoom(request.params.slug)))

    // Serve the credits on /credits
    app.get('/credits', (request, response) => response.json(credits))
  }

  return apiFunctions
}

module.exports = API
